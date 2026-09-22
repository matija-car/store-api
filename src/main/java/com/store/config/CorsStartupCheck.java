package com.store.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
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
