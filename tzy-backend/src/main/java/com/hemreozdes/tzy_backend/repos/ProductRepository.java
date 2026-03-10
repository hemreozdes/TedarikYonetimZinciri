package com.hemreozdes.tzy_backend.repos;

import com.hemreozdes.tzy_backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
