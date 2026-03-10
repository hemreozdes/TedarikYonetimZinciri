package com.hemreozdes.tzy_backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int stockQuantity;

    @Column(nullable = false)
    private double unitCost;

    @Column(nullable = false)
    private double unitSalePrice;

    public Product() {}
    public Product(Long id, String name, int stockQuantity, double unitCost, double unitSalePrice) {
        this.id = id;
        this.name = name;
        this.stockQuantity = stockQuantity;
        this.unitCost = unitCost;
        this.unitSalePrice = unitSalePrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public double getUnitCost() { return unitCost; }
    public void setUnitCost(double unitCost) { this.unitCost = unitCost; }

    public double getUnitSalePrice() { return unitSalePrice; }
    public void setUnitSalePrice(double unitSalePrice) { this.unitSalePrice = unitSalePrice; }
}
