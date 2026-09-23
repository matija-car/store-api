package com.store.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemRequestDTO {

    @NotNull(message = "ID proizvoda je obvezan")
    @Positive(message = "ID proizvoda mora biti valjan")
    private Long productId;

    @NotNull(message = "Količina je obvezna")
    @Positive(message = "Količina mora biti najmanje 1")
    @jakarta.validation.constraints.Max(value = 100, message = "Količina ne može biti veća od 100")
    private Integer quantity;
}