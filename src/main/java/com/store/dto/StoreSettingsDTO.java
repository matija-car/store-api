package com.store.dto;

import com.store.entity.StoreMode;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettingsDTO {
    @NotNull
    private StoreMode mode;
}
