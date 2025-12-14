package com.example.jewellery.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jewellery.model.JewelleryProduct;
import com.example.jewellery.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    public JewelleryProduct addProduct(@RequestBody JewelleryProduct product) {
        return service.addProduct(product);
    }

    @GetMapping
    public List<JewelleryProduct> getProducts() {
        return service.getAllProducts();
    }

    @PutMapping("/{id}")
    public ResponseEntity<JewelleryProduct> updateProduct(@PathVariable long id, @RequestBody JewelleryProduct product) {
        JewelleryProduct updated = service.updateProduct(id, product);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable long id) {
        boolean ok = service.deleteProduct(id);
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
