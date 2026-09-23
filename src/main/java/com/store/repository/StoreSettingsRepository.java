package com.store.repository;

import com.store.entity.StoreSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreSettingsRepository extends JpaRepository<StoreSettings, Long> {
}
