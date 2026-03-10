package com.hemreozdes.tzy_backend.services;

import com.hemreozdes.tzy_backend.dtos.requests.ExpenseRequest;
import com.hemreozdes.tzy_backend.dtos.responses.ExpenseResponse;
import com.hemreozdes.tzy_backend.dtos.responses.ProfitResponse;
import com.hemreozdes.tzy_backend.entities.Expense;
import com.hemreozdes.tzy_backend.entities.Order;
import com.hemreozdes.tzy_backend.repos.ExpenseRepository;
import com.hemreozdes.tzy_backend.repos.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final OrderRepository orderRepository;
    public ExpenseService(ExpenseRepository expenseRepository, OrderRepository orderRepository) {
        this.expenseRepository = expenseRepository;
        this.orderRepository = orderRepository;
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setType(request.getType());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gider bulunamadı: " + id));
        return toResponse(expense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Gider bulunamadı: " + id);
        }
        expenseRepository.deleteById(id);
    }

    public ProfitResponse calculateProfit(LocalDate start, LocalDate end) {
        List<Order> orders = orderRepository.findByOrderDateBetween(start, end);
        //Tarih aralığındaki siparişleri çek
        double totalRevenue = orders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum(); ////tüm siparişlerin totalPrice toplamı
        double totalCost = orders.stream()
                .mapToDouble(o -> o.getQuantity() * o.getProduct().getUnitCost())
                .sum(); //quantity * unitCost toplamı (her sipariş için)
        double grossProfit = totalRevenue - totalCost;

        List<Expense> expenses = expenseRepository.findByDateBetween(start, end);
        //Tarih aralığındaki giderleri çek
        double totalExpenses = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
        double netProfit = grossProfit - totalExpenses;

        return new ProfitResponse(totalRevenue, totalCost, grossProfit, totalExpenses, netProfit);
    }

    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getType(),
                expense.getAmount(),
                expense.getDate()
        );
    }
}
