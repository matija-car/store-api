package com.store.dto;

import com.store.entity.CommissionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRequestStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private CommissionStatus status;
}
