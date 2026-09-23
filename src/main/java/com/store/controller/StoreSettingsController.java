package com.store.controller;

import com.store.dto.StoreSettingsDTO;
import com.store.service.StoreSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class StoreSettingsController {

    private final StoreSettingsService storeSettingsService;

    @GetMapping("/store-settings")
    public ResponseEntity<StoreSettingsDTO> getSettings() {
        return ResponseEntity.ok(storeSettingsService.getSettings());
    }

    @PatchMapping("/admin/store-settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreSettingsDTO> updateSettings(@Valid @RequestBody StoreSettingsDTO request) {
        return ResponseEntity.ok(storeSettingsService.updateSettings(request));
    }
}
