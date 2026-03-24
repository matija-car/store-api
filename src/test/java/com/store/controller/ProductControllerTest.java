package com.store.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.store.dto.ProductDto;
import com.store.exception.ResourceNotFoundException;
import com.store.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@DisplayName("ProductController Tests")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductDto productDto;

    @BeforeEach
    void setUp() {
        productDto = new ProductDto(null, "Laptop", new BigDecimal("999.99"), "High performance laptop for developers", 1);
    }

    @Test
    @DisplayName("Should get all products")
    void testGetAllProducts() throws Exception {
        ProductDto product = new ProductDto(1L, "Laptop", new BigDecimal("999.99"), "High performance laptop", 1);
        Page<ProductDto> page = new PageImpl<>(Arrays.asList(product), PageRequest.of(0, 20), 1);

        when(productService.getAllProducts(null, PageRequest.of(0, 20))).thenReturn(page);

        mockMvc.perform(get("/products")
                        .param("page", "0")
                        .param("size", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Laptop"));

        verify(productService, times(1)).getAllProducts(null, PageRequest.of(0, 20));
    }

    @Test
    @DisplayName("Should get products by category")
    void testGetProductsByCategoryId() throws Exception {
        ProductDto product = new ProductDto(1L, "Mouse", new BigDecimal("29.99"), "Wireless mouse", 2);
        Page<ProductDto> page = new PageImpl<>(Arrays.asList(product), PageRequest.of(0, 20), 1);

        when(productService.getAllProducts(2, PageRequest.of(0, 20))).thenReturn(page);

        mockMvc.perform(get("/products")
                        .param("categoryId", "2")
                        .param("page", "0")
                        .param("size", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Mouse"));

        verify(productService, times(1)).getAllProducts(2, PageRequest.of(0, 20));
    }

    @Test
    @DisplayName("Should create product successfully")
    void testCreateProductSuccess() throws Exception {
        ProductDto createdProduct = new ProductDto(1L, "Laptop", new BigDecimal("999.99"), "High performance laptop for developers", 1);
        when(productService.createProduct(any(ProductDto.class))).thenReturn(createdProduct);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"));

        verify(productService, times(1)).createProduct(any(ProductDto.class));
    }

    @Test
    @DisplayName("Should update product")
    void testUpdateProduct() throws Exception {
        ProductDto updatedProduct = new ProductDto(1L, "Laptop Pro", new BigDecimal("1299.99"), "High performance laptop", 1);
        when(productService.updateProduct(eq(1L), any(ProductDto.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop Pro"));

        verify(productService, times(1)).updateProduct(eq(1L), any(ProductDto.class));
    }

    @Test
    @DisplayName("Should delete product")
    void testDeleteProduct() throws Exception {
        mockMvc.perform(delete("/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(1L);
    }

    @Test
    @DisplayName("Should get product by id")
    void testGetProductById() throws Exception {
        ProductDto product = new ProductDto(1L, "Laptop", new BigDecimal("999.99"), "High performance laptop", 1);
        when(productService.getProductById(1L)).thenReturn(product);

        mockMvc.perform(get("/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"));

        verify(productService, times(1)).getProductById(1L);
    }

    @Test
    @DisplayName("Should return 404 for non-existent product")
    void testGetProductNotFound() throws Exception {
        when(productService.getProductById(999L))
                .thenThrow(new ResourceNotFoundException("Product not found with id: 999"));

        mockMvc.perform(get("/products/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found with id: 999"));
    }
}