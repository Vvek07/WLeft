package com.wleft.controller;

import com.wleft.entity.Product;
import com.wleft.repository.ProductRepository;
import com.wleft.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<?> restockProduct(@PathVariable Long id) {
        inventoryService.restockProduct(id);
        return ResponseEntity.ok("Product restocked successfully");
    }
}
