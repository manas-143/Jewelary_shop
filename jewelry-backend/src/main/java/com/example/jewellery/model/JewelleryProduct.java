package com.example.jewellery.model;

public class JewelleryProduct {
	private long id;
    private String name;
    private String category;
    private double gram;
    private int carat;
    private double price;
    private String barcodeImagePath;  // path to saved QR/barcode image

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

}
