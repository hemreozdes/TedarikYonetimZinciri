package com.hemreozdes.tzy_backend.dtos.requests;

public class ProductRequest {
    private String name;
    private int stockQuantity;
    private double unitCost;
    private double unitSalePrice;

    public ProductRequest() {
    }
    public ProductRequest(String name, int stockQuantity, double unitCost, double unitSalePrice) {
        this.name = name;
        this.stockQuantity = stockQuantity;
        this.unitCost = unitCost;
        this.unitSalePrice = unitSalePrice;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public double getUnitCost() {
        return unitCost;
    }
    public void setUnitCost(double unitCost) {
        this.unitCost = unitCost;
    }

    public double getUnitSalePrice() {
        return unitSalePrice;
    }
    public void setUnitSalePrice(double unitSalePrice) {
        this.unitSalePrice = unitSalePrice;
    }
}
