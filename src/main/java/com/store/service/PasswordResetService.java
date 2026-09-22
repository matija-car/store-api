package com.store.service;

import com.store.entity.PasswordResetToken;
import com.store.entity.User;
import com.store.repository.PasswordResetTokenRepository;
import com.store.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;

@Service
@AllArgsConstructor
@Slf4j
public class PasswordResetService {

    private static final long RESET_TOKEN_TTL_MINUTES = 60;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    /**
     * Always succeeds from the caller's point of view, whether or not the email
     * exists — the controller must return the same response either way, or the
     * endpoint becomes a way to enumerate registered emails.
     */
    @Transactional
    public void requestReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String rawToken = generateRawToken();

            PasswordResetToken entity = PasswordResetToken.builder()
                    .tokenHash(hash(rawToken))
                    .user(user)
                    .expiryDate(Instant.now().plus(RESET_TOKEN_TTL_MINUTES, ChronoUnit.MINUTES))
                    .used(false)
                    .build();
            resetTokenRepository.save(entity);

            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;

            // TODO: replace with a real transactional email send (e.g. Spring Mail +
            // an SMTP provider like SendGrid/Mailgun/Resend) before going live.
            // Logging it here keeps the flow testable without email infra set up yet.
            log.info("Password reset requested for {}. Reset link (would be emailed): {}", email, resetLink);
        });
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken entity = resetTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (entity.isUsed() || entity.isExpired()) {
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        User user = entity.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        entity.setUsed(true);
        resetTokenRepository.save(entity);

        // A password reset is a strong security event — kill every existing
        // session so a stolen refresh token stops working too.
        refreshTokenService.revokeAllForUser(user);

        log.info("Password reset completed for user id {}", user.getId());
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}