package com.store.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "store_settings")
@Getter
@Setter
@NoArgsConstructor
public class StoreSettings {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StoreMode mode;

    public StoreSettings(Long id, StoreMode mode) {
        this.id = id;
        this.mode = mode;
    }
}
