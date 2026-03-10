package com.hemreozdes.tzy_backend.dtos.responses;

import com.hemreozdes.tzy_backend.entities.Expense.ExpenseType;

import java.time.LocalDate;

public class ExpenseResponse {
    private Long id;
    private ExpenseType type;
    private double amount;
    private LocalDate date;

    public ExpenseResponse() {}
    public ExpenseResponse(Long id, ExpenseType type, double amount, LocalDate date) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.date = date;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public ExpenseType getType() {
        return type;
    }
    public void setType(ExpenseType type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
}
