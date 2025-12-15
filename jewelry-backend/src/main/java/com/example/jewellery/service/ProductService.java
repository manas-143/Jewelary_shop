package com.example.jewellery.service;

import org.springframework.stereotype.Service;

import com.example.jewellery.model.JewelleryProduct;
import com.example.jewellery.util.BarcodeGenerator;
import com.example.jewellery.util.QRCodeGenerator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ObjectMapper mapper = new ObjectMapper();
    private final QRCodeGenerator qrGenerator;
    private final BarcodeGenerator barcodeGenerator;

    private final String filePath = "src/main/resources/products.json";
    private final String qrFolder = "src/main/resources/qrs/";
    private final String barCodeFolder = "src/main/resources/barcodes/";

    public ProductService(QRCodeGenerator qrGenerator, BarcodeGenerator barcodeGenerator) {
        this.qrGenerator = qrGenerator;
        this.barcodeGenerator = barcodeGenerator;

        // Create folder if not exists
        new File(qrFolder).mkdirs();
        // ensure barcode folder exists as well
        new File(barCodeFolder).mkdirs();
    }

    public List<JewelleryProduct> getAllProducts() {
        try {
            File file = new File(filePath);
            if (!file.exists()) return new ArrayList<>();

            return mapper.readValue(file, new TypeReference<List<JewelleryProduct>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error reading file: " + e.getMessage());
        }
    }

    private long getNextId(List<JewelleryProduct> list) {
        return list.isEmpty() ? 1 : list.get(list.size() - 1).getId() + 1;
    }

    public JewelleryProduct addProduct(JewelleryProduct product) {
        try {
            List<JewelleryProduct> list = getAllProducts();

            long newId = getNextId(list);
            product.setId(newId);

            // set created date and default inStock
            String created = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            product.setCreatedDate(created);
            product.setInStock(true);
            product.setDeletedBy(null);

            // generate a product code: PREFIX-MM-SEQ (e.g. CH-12-0001)
            String category = product.getCategory() != null ? product.getCategory().trim() : "";
            String prefix;
            switch (category.toLowerCase()) {
                case "chain": prefix = "CH"; break;
                case "earring": prefix = "EA"; break;
                case "ladies ring": prefix = "LR"; break;
                case "gents ring": prefix = "GR"; break;
                case "tops": prefix = "TP"; break;
                case "rani hara": prefix = "RH"; break;
                case "bangals": prefix = "BG"; break;
                case "mangalsutra": prefix = "MS"; break;
                case "chika hara": prefix = "CH"; break;
                default:
                    // fallback to first two letters of category (uppercased) or 'PR'
                    if (category.length() >= 2) prefix = category.substring(0,2).toUpperCase(); else prefix = "PR";
            }

            String month = String.format("%02d", java.time.LocalDate.now().getMonthValue());

            // count existing for this prefix+month to create a sequential number
            int seq = 1;
            try {
                seq = (int) list.stream()
                        .filter(p -> p != null && p.getProductCode() != null)
                        .filter(p -> p.getProductCode().startsWith(prefix + "-" + month + "-"))
                        .count() + 1;
            } catch (Exception ex) {
                // fallback to nextId if anything goes wrong
                seq = (int) newId;
            }
            String seqStr = String.format("%04d", seq);
            String productCode = prefix + "-" + month + "-" + seqStr;
            product.setProductCode(productCode);

			/*
			 * // Convert product details to text (QR content) String qrText = "ID: " +
			 * newId + "\nName: " + product.getName() + "\nCategory: " +
			 * product.getCategory() + "\nGram: " + product.getGram() + "\nCarat: " +
			 * product.getCarat() + "\nPrice: " + product.getPrice();
			 * 
			 * String qrFilePath = qrFolder + "product_" + newId + ".png";
			 * 
			 * // Generate QR Code Image qrGenerator.generateQRCode(qrText, qrFilePath);
			 * 
			 * product.setBarcodeImagePath(qrFilePath);
			 * 
			 * list.add(product);
			 * 
			 * mapper.writerWithDefaultPrettyPrinter() .writeValue(new File(filePath),
			 * list);
			 * 
			 * return product;
			 */
            
         // Prepare barcode content (single line recommended for CODE_128)
            String barcodeText =
                    "ID=" + newId +
                    "|NAME=" + product.getName() +
                    "|CAT=" + product.getCategory() +
                    "|GRAM=" + product.getGram() +
                    "|CARAT=" + product.getCarat() +
                    "|PRICE=" + product.getPrice();

            String barcodeFilePath = barCodeFolder + "product_" + newId + ".png";

            // Ensure parent directory exists (fixes ImageOutputStream creation failures)
            try {
                File parent = new File(barcodeFilePath).getParentFile();
                if (parent != null && !parent.exists()) parent.mkdirs();
            } catch (Exception ex) {
                // ignore and let generator throw meaningful error
            }

            // Generate BARCODE (replaces QR code)
            barcodeGenerator.generateBarcode(barcodeText, barcodeFilePath);

            // Save file path into product
            product.setBarcodeImagePath(barcodeFilePath);

            // Save updated list into JSON file
            list.add(product);
            mapper.writerWithDefaultPrettyPrinter()
                  .writeValue(new File(filePath), list);

            return product;
            
        } catch (Exception e) {
            throw new RuntimeException("Error saving product: " + e.getMessage());
        }
    }

    public JewelleryProduct updateProduct(long id, JewelleryProduct updated) {
        try {
            List<JewelleryProduct> list = getAllProducts();
            for (int i = 0; i < list.size(); i++) {
                JewelleryProduct p = list.get(i);
                if (p.getId() == id) {
                    // update mutable fields
                    p.setName(updated.getName());
                    p.setCategory(updated.getCategory());
                    p.setGram(updated.getGram());
                    p.setCarat(updated.getCarat());
                    p.setPrice(updated.getPrice());
                    // do not overwrite createdDate, inStock or deletedBy unless explicitly provided
                    if (updated.getCreatedDate() != null) p.setCreatedDate(updated.getCreatedDate());
                    p.setInStock(updated.isInStock());
                    if (updated.getDeletedBy() != null) p.setDeletedBy(updated.getDeletedBy());
                    // keep existing barcodeImagePath to avoid regenerating files

                    // persist
                    mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), list);
                    return p;
                }
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error updating product: " + e.getMessage());
        }
    }

    public boolean deleteProduct(long id, String deletedBy) {
        try {
            List<JewelleryProduct> list = getAllProducts();
            for (int i = 0; i < list.size(); i++) {
                JewelleryProduct p = list.get(i);
                if (p.getId() == id) {
                    // soft delete: mark deletedBy (from request) and set inStock = false
                    p.setInStock(false);
                    p.setDeletedBy(deletedBy != null ? deletedBy : "api");
                    mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), list);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting product: " + e.getMessage());
        }
    }

    // new: fetch products with optional filters
    // includeDeleted: if true, include items where inStock==false. By default (null/false) exclude deleted (inStock==false)
    public List<JewelleryProduct> getProducts(String category, String createdDate, Boolean includeDeleted, Boolean onlyDeleted) {
        List<JewelleryProduct> list = getAllProducts();

        boolean showDeleted = includeDeleted != null && includeDeleted.booleanValue();
        boolean justDeleted = onlyDeleted != null && onlyDeleted.booleanValue();

        return list.stream()
                .filter(p -> p != null)
                .filter(p -> {
                    if (justDeleted) {
                        // include only deleted items
                        return !p.isInStock();
                    }
                    if (!showDeleted) {
                        // only include items that are in stock
                        return p.isInStock();
                    }
                    return true;
                })
                .filter(p -> {
                    if (category == null || category.trim().isEmpty()) return true;
                    if (p.getCategory() == null) return false;
                    return p.getCategory().toLowerCase(Locale.ROOT).equals(category.toLowerCase(Locale.ROOT));
                })
                .filter(p -> {
                    if (createdDate == null || createdDate.trim().isEmpty()) return true;
                    if (p.getCreatedDate() == null) return false;
                    // createdDate param expected as YYYY-MM-DD; product createdDate stored as ISO_LOCAL_DATE_TIME
                    return p.getCreatedDate().startsWith(createdDate);
                })
                .collect(Collectors.toList());
    }
}
