package com.store.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthRateLimiter {

    private static final long WINDOW_SECONDS = 60;
    private static final int MAX_LOGIN_ATTEMPTS = 10;
    private static final int MAX_REGISTER_ATTEMPTS = 5;
    private static final int MAX_FORGOT_PASSWORD_ATTEMPTS = 5;

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public boolean allow(String endpoint, String ip, String email) {
        String key = endpoint + ":" + ip + ":" + (email == null ? "" : email.trim().toLowerCase());
        long now = Instant.now().getEpochSecond();
        int limit = switch (endpoint) {
            case "login" -> MAX_LOGIN_ATTEMPTS;
            case "register", "forgot-password" -> endpoint.equals("register")
                    ? MAX_REGISTER_ATTEMPTS : MAX_FORGOT_PASSWORD_ATTEMPTS;
            default -> 1;
        };
        Window window = windows.compute(key, (ignored, current) -> {
            if (current == null || now - current.startedAt >= WINDOW_SECONDS) {
                return new Window(now, 1);
            }
            return new Window(current.startedAt, current.count + 1);
        });
        return window.count <= limit;
    }

    private record Window(long startedAt, int count) {
    }
}
