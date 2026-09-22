package com.store.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class JwtSecretStartupCheck {

    private static final String DEVELOPMENT_FALLBACK =
            "local-dev-secret-key-this-is-only-for-development-and-testing-ok";

    private final Environment environment;
    private final String jwtSecret;

    public JwtSecretStartupCheck(
            Environment environment,
            @Value("${jwt.secret}") String jwtSecret) {
        this.environment = environment;
        this.jwtSecret = jwtSecret;
    }

    @PostConstruct
    void validateSecret() {
        boolean production = Arrays.stream(environment.getActiveProfiles())
                .anyMatch(profile -> profile.equalsIgnoreCase("prod")
                        || profile.equalsIgnoreCase("production"));
        if (production && (DEVELOPMENT_FALLBACK.equals(jwtSecret) || jwtSecret.length() < 32)) {
            throw new IllegalStateException(
                    "A production JWT_SECRET must be configured and contain at least 32 characters");
        }
    }
}
