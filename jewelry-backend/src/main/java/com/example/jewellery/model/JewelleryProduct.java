package com.example.jewellery.model;

public class JewelleryProduct {
	private long id;
    private String name;
    private String category;
    private double gram;
    private int carat;
    private double price;
    private String barcodeImagePath;  // path to saved QR/barcode image
    private String createdDate; // ISO datetime string when product was created
    private boolean inStock = true; // whether the product is currently in stock
    private String deletedBy; // username or identifier who deleted the product (for soft delete)
    private String productCode; // generated code like CH-12-0001

    public JewelleryProduct() {}

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getGram() { return gram; }
    public void setGram(double gram) { this.gram = gram; }

    public int getCarat() { return carat; }
    public void setCarat(int carat) { this.carat = carat; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getBarcodeImagePath() { return barcodeImagePath; }
    public void setBarcodeImagePath(String barcodeImagePath) { this.barcodeImagePath = barcodeImagePath; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public String getDeletedBy() { return deletedBy; }
    public void setDeletedBy(String deletedBy) { this.deletedBy = deletedBy; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

}
