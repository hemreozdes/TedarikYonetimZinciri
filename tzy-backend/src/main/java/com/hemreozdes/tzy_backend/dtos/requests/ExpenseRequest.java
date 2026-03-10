package com.hemreozdes.tzy_backend.dtos.requests;

import com.hemreozdes.tzy_backend.entities.Expense.ExpenseType;

import java.time.LocalDate;

public class ExpenseRequest {
    private ExpenseType type;
    private double amount;
    private LocalDate date;

    public ExpenseRequest() {}
    public ExpenseRequest(ExpenseType type, double amount, LocalDate date) {
        this.type = type;
        this.amount = amount;
        this.date = date;
    }

    public ExpenseType getType() { return type; }
    public void setType(ExpenseType type) { this.type = type; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
