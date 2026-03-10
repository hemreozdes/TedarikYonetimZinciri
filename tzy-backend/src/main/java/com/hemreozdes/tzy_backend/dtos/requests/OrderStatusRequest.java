package com.hemreozdes.tzy_backend.dtos.requests;

import com.hemreozdes.tzy_backend.entities.Order.OrderStatus;

public class OrderStatusRequest {
    private OrderStatus status;

    public OrderStatusRequest() {}
    public OrderStatusRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
