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
    public List<JewelleryProduct> getProducts(@org.springframework.web.bind.annotation.RequestParam(required = false) String category,
                                               @org.springframework.web.bind.annotation.RequestParam(required = false) String createdDate,
                                               @org.springframework.web.bind.annotation.RequestParam(required = false) Boolean includeDeleted,
                                               @org.springframework.web.bind.annotation.RequestParam(required = false) Boolean onlyDeleted) {
        // createdDate expected as YYYY-MM-DD (e.g. 2025-12-14)
        // includeDeleted=true will include soft-deleted items (inStock==false) along with in-stock items
        // onlyDeleted=true will return only inStock==false items
        return service.getProducts(category, createdDate, includeDeleted, onlyDeleted);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JewelleryProduct> updateProduct(@PathVariable long id, @RequestBody JewelleryProduct product) {
        JewelleryProduct updated = service.updateProduct(id, product);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable long id,
                                              @org.springframework.web.bind.annotation.RequestParam(required = false) String deletedBy) {
        boolean ok = service.deleteProduct(id, deletedBy);
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
