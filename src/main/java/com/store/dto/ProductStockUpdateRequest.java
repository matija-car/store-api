package com.store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductStockUpdateRequest {

    @NotNull(message = "Količina zalihe je obvezna")
    @Min(value = 0, message = "Količina zalihe ne može biti negativna")
    private Integer stockQuantity;
}
