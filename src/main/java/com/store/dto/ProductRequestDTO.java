package com.store.dto;

import com.store.entity.PieceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDTO {

    public ProductRequestDTO(String name, String description, BigDecimal price, String imageUrl,
                            Integer stockQuantity, Long categoryId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
        this.categoryId = categoryId;
        this.pieceType = PieceType.PRINT;
        this.causeEnabled = false;
    }

    @NotBlank(message = "Naziv proizvoda je obvezan")
    private String name;

    private String description;

    @NotNull(message = "Cijena je obvezna")
    @Positive(message = "Cijena mora biti veća od 0")
    private BigDecimal price;

    private String imageUrl;

    @Min(value = 0, message = "Količina ne može biti negativna")
    private Integer stockQuantity;

    private Long categoryId;

    @Builder.Default
    private PieceType pieceType = PieceType.PRINT;

    @Builder.Default
    private boolean causeEnabled = false;

    private String causeDescription;
}