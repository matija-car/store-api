package com.store.service;

import com.store.dto.ProductDto;
import com.store.entity.Category;
import com.store.entity.Product;
import com.store.exception.ResourceNotFoundException;
import com.store.repository.CategoryRepository;
import com.store.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@DisplayName("ProductService Integration Tests")
class ProductServiceIntegrationTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category category;
    private ProductDto productDto;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        category = categoryRepository.save(new Category("Electronics"));

        productDto = new ProductDto(null, "Laptop", new BigDecimal("999.99"),
                "High performance laptop for developers", category.getId());
    }

    @Test
    @DisplayName("Should create product successfully")
    void testCreateProduct() {
        ProductDto createdProduct = productService.createProduct(productDto);

        assertNotNull(createdProduct.getId());
        assertEquals("Laptop", createdProduct.getName());
        assertEquals(new BigDecimal("999.99"), createdProduct.getPrice());
        assertEquals(category.getId(), createdProduct.getCategoryId());

        Product savedProduct = productRepository.findById(createdProduct.getId()).orElse(null);
        assertNotNull(savedProduct);
        assertEquals("Laptop", savedProduct.getName());
        assertEquals(category.getId(), savedProduct.getCategory().getId());
    }

    @Test
    @DisplayName("Should throw exception when category not found")
    void testCreateProductCategoryNotFound() {
        productDto.setCategoryId(9999);
        assertThrows(ResourceNotFoundException.class, () -> productService.createProduct(productDto));
    }

    @Test
    @DisplayName("Should get all products with pagination")
    void testGetAllProducts() {
        productService.createProduct(productDto);
        productService.createProduct(new ProductDto(null, "Mouse", new BigDecimal("29.99"),
                "Wireless mouse", category.getId()));

        Page<ProductDto> productsPage = productService.getAllProducts(null, PageRequest.of(0, 20));

        assertEquals(2, productsPage.getTotalElements());
    }

    @Test
    @DisplayName("Should get products by category id with pagination")
    void testGetProductsByCategoryId() {
        productService.createProduct(productDto);

        Category category2 = categoryRepository.save(new Category("Furniture"));
        productService.createProduct(new ProductDto(null, "Desk", new BigDecimal("299.99"),
                "Office desk", category2.getId()));

        Page<ProductDto> productsPage = productService.getAllProducts(category.getId(), PageRequest.of(0, 20));

        assertEquals(1, productsPage.getTotalElements());
        assertEquals("Laptop", productsPage.getContent().get(0).getName());
    }

    @Test
    @DisplayName("Should get product by id")
    void testGetProductById() {
        ProductDto createdProduct = productService.createProduct(productDto);
        ProductDto foundProduct = productService.getProductById(createdProduct.getId());

        assertEquals(createdProduct.getId(), foundProduct.getId());
        assertEquals("Laptop", foundProduct.getName());
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void testGetProductByIdNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(999L));
    }

    @Test
    @DisplayName("Should update product successfully")
    void testUpdateProduct() {
        ProductDto createdProduct = productService.createProduct(productDto);
        ProductDto updateDto = new ProductDto(createdProduct.getId(), "Gaming Laptop",
                new BigDecimal("1499.99"), "High performance gaming laptop", category.getId());

        ProductDto updatedProduct = productService.updateProduct(createdProduct.getId(), updateDto);

        assertEquals("Gaming Laptop", updatedProduct.getName());
        assertEquals(new BigDecimal("1499.99"), updatedProduct.getPrice());

        Product savedProduct = productRepository.findById(createdProduct.getId()).orElse(null);
        assertNotNull(savedProduct);
        assertEquals("Gaming Laptop", savedProduct.getName());
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent product")
    void testUpdateProductNotFound() {
        assertThrows(ResourceNotFoundException.class, () ->
                productService.updateProduct(999L, productDto));
    }

    @Test
    @DisplayName("Should delete product successfully")
    void testDeleteProduct() {
        ProductDto createdProduct = productService.createProduct(productDto);
        productService.deleteProduct(createdProduct.getId());
        assertFalse(productRepository.existsById(createdProduct.getId()));
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent product")
    void testDeleteProductNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(999L));
    }

    @Test
    @DisplayName("Should update product category")
    void testUpdateProductCategory() {
        ProductDto createdProduct = productService.createProduct(productDto);

        Category newCategory = categoryRepository.save(new Category("Books"));
        ProductDto updateDto = new ProductDto(createdProduct.getId(), "Laptop",
                new BigDecimal("999.99"), "High performance laptop", newCategory.getId());

        ProductDto updatedProduct = productService.updateProduct(createdProduct.getId(), updateDto);

        assertEquals(newCategory.getId(), updatedProduct.getCategoryId());

        Product savedProduct = productRepository.findById(createdProduct.getId()).orElse(null);
        assertNotNull(savedProduct);
        assertEquals(newCategory.getId(), savedProduct.getCategory().getId());
    }

    @Test
    @DisplayName("Should throw exception when category not found during update")
    void testUpdateProductCategoryNotFound() {
        ProductDto createdProduct = productService.createProduct(productDto);
        ProductDto updateDto = new ProductDto(createdProduct.getId(), "Laptop",
                new BigDecimal("999.99"), "High performance laptop", 9999);

        assertThrows(ResourceNotFoundException.class, () ->
                productService.updateProduct(createdProduct.getId(), updateDto));
    }
}