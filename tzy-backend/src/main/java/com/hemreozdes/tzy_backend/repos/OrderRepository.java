package com.hemreozdes.tzy_backend.repos;

import com.hemreozdes.tzy_backend.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderDateBetween(LocalDate start, LocalDate end);
    List<Order> findByStatus(String status);
    List<Order> findByIsPaid(boolean isPaid);
}
