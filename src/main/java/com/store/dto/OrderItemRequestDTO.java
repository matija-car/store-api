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
    private Long productId;

    @NotNull(message = "Količina je obvezna")
    @Positive(message = "Količina mora biti najmanje 1")
    private Integer quantity;
}