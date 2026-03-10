package com.hemreozdes.tzy_backend.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseType type;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private LocalDate date;

    public enum ExpenseType {LOJISTIK, GUMRUK, DEPO_KIRA, DIGER}

    public Expense() {}
    public Expense(Long id, ExpenseType type, double amount, LocalDate date) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExpenseType getType() { return type; }
    public void setType(ExpenseType type) { this.type = type; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
