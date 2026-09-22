package com.store.dto;

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
}