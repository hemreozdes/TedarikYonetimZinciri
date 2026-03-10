package com.hemreozdes.tzy_backend.services;

import com.hemreozdes.tzy_backend.dtos.requests.OrderStatusRequest;
import com.hemreozdes.tzy_backend.dtos.requests.OrderRequest;
import com.hemreozdes.tzy_backend.dtos.responses.OrderResponse;
import com.hemreozdes.tzy_backend.entities.Order;
import com.hemreozdes.tzy_backend.entities.Order.OrderStatus;
import com.hemreozdes.tzy_backend.entities.Product;
import com.hemreozdes.tzy_backend.repos.OrderRepository;
import com.hemreozdes.tzy_backend.repos.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public OrderResponse createOrder(OrderRequest request) {
        if (!request.getIsPaid()) {
            throw new RuntimeException("Ödeme alınmadan sipariş oluşturulamaz!");
            //isPaid false ise direkt hata fırlatır
        }
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı: " + request.getProductId()));
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Yetersiz stok! Mevcut stok: " + product.getStockQuantity());
            //Stok yeterli mi kontrol eder
        }

        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);
        //Stoku düşürür, siparişi oluşturur
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setQuantity(request.getQuantity());
        order.setTotalPrice(request.getQuantity() * product.getUnitSalePrice());
        order.setStatus(OrderStatus.HAZIRLANIYOR);
        order.setIsPaid(true);
        order.setOrderDate(LocalDate.now());
        order.setProduct(product);

        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı: " + id));
        return toResponse(order);
    }

    //Statü geçişlerini kontrol eder
    public OrderResponse updateOrderStatus(Long id, OrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı: " + id));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();
        if (currentStatus == OrderStatus.TESLIM_EDILDI) {
            throw new RuntimeException("Teslim edilen sipariş güncellenemez!");
        }
        if (currentStatus == OrderStatus.HAZIRLANIYOR && newStatus != OrderStatus.YOLDA) {
            throw new RuntimeException("HAZIRLANIYOR → sadece YOLDA'ya geçebilir!");
        }
        if (currentStatus == OrderStatus.YOLDA && newStatus != OrderStatus.TESLIM_EDILDI) {
            throw new RuntimeException("YOLDA → sadece TESLIM_EDILDI'ye geçebilir!");
        }

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı: " + id));
        if (order.getStatus() != OrderStatus.HAZIRLANIYOR) {
            throw new RuntimeException("Sadece HAZIRLANIYOR statüsündeki siparişler silinebilir!");
        }

        Product product = order.getProduct();
        product.setStockQuantity(product.getStockQuantity() + order.getQuantity());
        productRepository.save(product);

        orderRepository.deleteById(id);
    }

    public OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getIsPaid(),
                order.getOrderDate(),
                order.getProduct().getName()
        );
    }
}
