package com.wleft.service;

import com.wleft.entity.Product;
import com.wleft.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String ADMIN_EMAIL = "admin@nexusstock.com";
    private static final int LOW_STOCK_THRESHOLD = 5;

    @Transactional
    public void processSale(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() >= quantity) {
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);

            checkAndAlertLowStock(product);
            System.out.println(
                    "Stock updated for product: " + product.getTitle() + ". New Quantity: " + product.getQuantity());
        } else {
            System.out.println("Attempted to sell out-of-stock product: " + product.getTitle());
            // Optionally throw exception or handle gracefully
        }
    }

    private void checkAndAlertLowStock(Product product) {
        if (product.getQuantity() < LOW_STOCK_THRESHOLD) {
            sendLowStockAlert(product);
        }
    }

    private void sendLowStockAlert(Product product) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail); // Mailtrap sender
            message.setTo(ADMIN_EMAIL);
            message.setSubject("URGENT: Low Stock Alert - " + product.getTitle());
            message.setText("Stock Low for " + product.getTitle() + "!\n\n" +
                    "Current Quantity: " + product.getQuantity() + "\n" +
                    "Restock immediately from the Admin Dashboard.");

            mailSender.send(message);
            System.out.println("Low stock alert email sent for: " + product.getTitle());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Boss Feature: Restock
    @Transactional
    public void restockProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setQuantity(20);
        productRepository.save(product);
        System.out.println("Product restocked: " + product.getTitle());
    }
}
