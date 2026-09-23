package com.store.service;

import com.store.dto.StoreSettingsDTO;
import com.store.entity.StoreMode;
import com.store.entity.StoreSettings;
import com.store.repository.StoreSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StoreSettingsService {

    private static final long SETTINGS_ID = 1L;
    private final StoreSettingsRepository repository;

    @Transactional(readOnly = true)
    public StoreSettingsDTO getSettings() {
        StoreSettings settings = repository.findById(SETTINGS_ID)
                .orElseGet(() -> new StoreSettings(SETTINGS_ID, StoreMode.STORE));
        return new StoreSettingsDTO(settings.getMode());
    }

    @Transactional(readOnly = true)
    public StoreMode getMode() {
        return getSettings().getMode();
    }

    @Transactional
    public StoreSettingsDTO updateSettings(StoreSettingsDTO request) {
        StoreSettings settings = repository.findById(SETTINGS_ID)
                .orElse(new StoreSettings(SETTINGS_ID, StoreMode.STORE));
        settings.setMode(request.getMode());
        repository.save(settings);
        return new StoreSettingsDTO(settings.getMode());
    }
}
