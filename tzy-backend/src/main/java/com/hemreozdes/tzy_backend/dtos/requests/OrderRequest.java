package com.hemreozdes.tzy_backend.dtos.requests;

public class OrderRequest {
    private String customerName;
    private int quantity;
    private Long productId;
    private boolean isPaid;

    public OrderRequest() {}
    public OrderRequest(String customerName, int quantity, Long productId, boolean isPaid) {
        this.customerName = customerName;
        this.quantity = quantity;
        this.productId = productId;
        this.isPaid = isPaid;
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public boolean getIsPaid() { return isPaid; }
    public void setIsPaid(boolean isPaid) { this.isPaid = isPaid; }
}
