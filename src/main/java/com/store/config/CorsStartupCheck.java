package com.store.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CorsStartupCheck {

    private final String allowedOrigins;
    private final String datasourceUrl;

    public CorsStartupCheck(
            @Value("${app.cors.allowed-origins:}") String allowedOrigins,
            @Value("${spring.datasource.url}") String datasourceUrl) {
        this.allowedOrigins = allowedOrigins;
        this.datasourceUrl = datasourceUrl;
    }

    @PostConstruct
    void validateOrigins() {
        log.info("Active CORS allowed origins: {}",
                allowedOrigins == null || allowedOrigins.isBlank() ? "(none)" : allowedOrigins);

        boolean h2Datasource = datasourceUrl != null
                && datasourceUrl.trim().toLowerCase().startsWith("jdbc:h2:");
        boolean containsLocalhost = allowedOrigins != null
                && allowedOrigins.toLowerCase().contains("localhost");

        if (!h2Datasource && containsLocalhost) {
            throw new IllegalStateException(
                    "A non-H2 deployment must not allow localhost as a CORS origin");
        }
    }
}
