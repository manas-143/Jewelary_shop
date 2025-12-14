package com.example.jewellery.service;

import org.springframework.stereotype.Service;

import com.example.jewellery.model.JewelleryProduct;
import com.example.jewellery.util.BarcodeGenerator;
import com.example.jewellery.util.QRCodeGenerator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

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

    public boolean deleteProduct(long id) {
        try {
            List<JewelleryProduct> list = getAllProducts();
            JewelleryProduct toRemove = null;
            for (JewelleryProduct p : list) {
                if (p.getId() == id) {
                    toRemove = p;
                    break;
                }
            }
            if (toRemove == null) return false;

            // remove barcode file if exists
            try {
                if (toRemove.getBarcodeImagePath() != null) {
                    File f = new File(toRemove.getBarcodeImagePath());
                    if (f.exists()) {
                        f.delete();
                    }
                }
            } catch (Exception ex) {
                // ignore file deletion errors
            }

            list.remove(toRemove);
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(filePath), list);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting product: " + e.getMessage());
        }
    }
}
