package com.store.controller;

import com.store.dto.ProductDto;
import com.store.dto.ProductRequestDTO;
import com.store.dto.ProductStockUpdateRequest;
import com.store.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "false") boolean includeInactive,
            Pageable pageable) {
        if ((search == null || search.isBlank()) && minPrice == null && maxPrice == null) {
            return ResponseEntity.ok(productService.getAllProducts(null, categoryId, null, null, includeInactive, pageable));
        }
        return ResponseEntity.ok(productService.getAllProducts(search, categoryId, minPrice, maxPrice, includeInactive, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductRequestDTO productRequest) {
        ProductDto created = productService.createProduct(productRequest);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO productRequest) {
        ProductDto updated = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductDto> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody ProductStockUpdateRequest request) {
        return ResponseEntity.ok(productService.updateStock(id, request.getStockQuantity()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restoreProduct(@PathVariable Long id) {
        productService.restoreProduct(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteProduct(@PathVariable Long id) {
        productService.permanentlyDeleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}