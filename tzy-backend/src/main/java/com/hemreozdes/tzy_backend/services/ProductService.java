package com.hemreozdes.tzy_backend.services;

import com.hemreozdes.tzy_backend.dtos.requests.ProductRequest;
import com.hemreozdes.tzy_backend.dtos.responses.ProductResponse;
import com.hemreozdes.tzy_backend.entities.Product;
import com.hemreozdes.tzy_backend.repos.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnitCost(request.getUnitCost());
        product.setUnitSalePrice(request.getUnitSalePrice());
        //Request'ten Product entity'si oluşturur, kaydeder, Response döner
        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        return toResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + id));
        //Mevcut ürünü bulur, alanları günceller
        product.setName(request.getName());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnitCost(request.getUnitCost());
        product.setUnitSalePrice(request.getUnitSalePrice());
        //kaydeder
        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Ürün bulunamadı: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getStockQuantity(),
                product.getUnitCost(),
                product.getUnitSalePrice()
                //Entity'den Response DTO'ya dönüşümü tek yerden yönetir, kod tekrarını önler
        );
    }
}
