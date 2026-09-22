package com.store.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtSecretStartupCheck {

    private static final String DEVELOPMENT_FALLBACK =
            "local-dev-secret-key-this-is-only-for-development-and-testing-ok";

    private final String jwtSecret;
    private final String datasourceUrl;

    public JwtSecretStartupCheck(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${spring.datasource.url}") String datasourceUrl) {
        this.jwtSecret = jwtSecret;
        this.datasourceUrl = datasourceUrl;
    }

    @PostConstruct
    void validateSecret() {
        boolean h2Datasource = datasourceUrl != null
                && datasourceUrl.trim().toLowerCase().startsWith("jdbc:h2:");
        boolean missingOrWeakSecret = jwtSecret == null
                || jwtSecret.isBlank()
                || DEVELOPMENT_FALLBACK.equals(jwtSecret)
                || jwtSecret.length() < 32;
        if (!h2Datasource && missingOrWeakSecret) {
            throw new IllegalStateException(
                    "A non-H2 deployment must configure JWT_SECRET with at least 32 characters");
        }
    }
}
