package com.hemreozdes.tzy_backend.dtos.responses;

import com.hemreozdes.tzy_backend.entities.Order.OrderStatus;

import java.time.LocalDate;

public class OrderResponse {
    private Long id;
    private String customerName;
    private int quantity;
    private double totalPrice;
    private OrderStatus status;
    private boolean isPaid;
    private LocalDate orderDate;
    private String productName;

    public OrderResponse() {
    }
    public OrderResponse(Long id, String customerName, int quantity, double totalPrice, OrderStatus status, boolean isPaid, LocalDate orderDate, String productName) {
        this.id = id;
        this.customerName = customerName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.isPaid = isPaid;
        this.orderDate = orderDate;
        this.productName = productName;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }
    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public boolean getIsPaid() { return isPaid; }
    public void setIsPaid(boolean isPaid) { this.isPaid = isPaid; }

    public LocalDate getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
}
