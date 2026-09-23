package com.store.service;

import com.store.dto.ProductDto;
import com.store.dto.ProductRequestDTO;
import com.store.entity.Category;
import com.store.entity.Product;
import com.store.exception.ResourceNotFoundException;
import com.store.repository.CategoryRepository;
import com.store.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(Number categoryId, Pageable pageable) {
        return getAllProducts(null, categoryId, null, null, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(
            String search,
            Number categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable) {
        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
        Long normalizedCategoryId = categoryId == null ? null : categoryId.longValue();
        return productRepository.search(normalizedSearch, normalizedCategoryId, minPrice, maxPrice, pageable)
                .map(this::mapToDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    public ProductDto createProduct(ProductDto productDto) {
        return createProduct(toRequest(productDto));
    }

    public ProductDto createProduct(ProductRequestDTO productRequest) {
        Category category = findCategory(productRequest.getCategoryId());

        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStockQuantity(productRequest.getStockQuantity() == null ? 0 : productRequest.getStockQuantity());
        product.setImageUrl(productRequest.getImageUrl());
        product.setPieceType(productRequest.getPieceType() == null ? com.store.entity.PieceType.PRINT : productRequest.getPieceType());
        product.setCauseEnabled(productRequest.isCauseEnabled());
        product.setCauseDescription(productRequest.getCauseDescription());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        return updateProduct(id, toRequest(productDto));
    }

    public ProductDto updateProduct(Long id, ProductRequestDTO productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = findCategory(productRequest.getCategoryId());

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStockQuantity(productRequest.getStockQuantity() == null
                ? product.getStockQuantity()
                : productRequest.getStockQuantity());
        product.setImageUrl(productRequest.getImageUrl());
        product.setPieceType(productRequest.getPieceType() == null ? com.store.entity.PieceType.PRINT : productRequest.getPieceType());
        product.setCauseEnabled(productRequest.isCauseEnabled());
        product.setCauseDescription(productRequest.getCauseDescription());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);
        return mapToDto(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setPieceType(product.getPieceType() == null ? com.store.entity.PieceType.PRINT : product.getPieceType());
        dto.setCauseEnabled(product.isCauseEnabled());
        dto.setCauseDescription(product.getCauseDescription());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        return dto;
    }

    private Category findCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private ProductRequestDTO toRequest(ProductDto productDto) {
        return ProductRequestDTO.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .stockQuantity(productDto.getStockQuantity())
                .categoryId(productDto.getCategoryId())
                .imageUrl(productDto.getImageUrl())
                .pieceType(productDto.getPieceType() == null ? com.store.entity.PieceType.PRINT : productDto.getPieceType())
                .causeEnabled(productDto.isCauseEnabled())
                .causeDescription(productDto.getCauseDescription())
                .build();
    }
}