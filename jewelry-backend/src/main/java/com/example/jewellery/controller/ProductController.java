package com.example.jewellery.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
}
