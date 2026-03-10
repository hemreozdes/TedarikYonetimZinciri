package com.hemreozdes.tzy_backend.dtos.responses;

public class ProfitResponse {
    private double totalRevenue;
    private double totalCost;
    private double grossProfit;
    private double totalExpenses;
    private double netProfit;

    public ProfitResponse() {}
    public ProfitResponse(double totalRevenue, double totalCost, double grossProfit,
                          double totalExpenses, double netProfit) {
        this.totalRevenue = totalRevenue;
        this.totalCost = totalCost;
        this.grossProfit = grossProfit;
        this.totalExpenses = totalExpenses;
        this.netProfit = netProfit;
    }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }

    public double getGrossProfit() { return grossProfit; }
    public void setGrossProfit(double grossProfit) { this.grossProfit = grossProfit; }

    public double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(double totalExpenses) { this.totalExpenses = totalExpenses; }

    public double getNetProfit() { return netProfit; }
    public void setNetProfit(double netProfit) { this.netProfit = netProfit; }
}
