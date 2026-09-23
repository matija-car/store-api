package com.store.service;

import com.store.entity.EmailVerificationToken;
import com.store.entity.User;
import com.store.repository.EmailVerificationTokenRepository;
import com.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.mail.MailException;
import lombok.extern.slf4j.Slf4j;
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
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private static final long TOKEN_TTL_HOURS = 24;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public void issueVerificationEmail(String email) {
        String normalizedEmail = email.trim();
        User user = userRepository.findByEmail(normalizedEmail)
                .or(() -> userRepository.findByEmailIgnoreCase(normalizedEmail))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String rawToken = generateRawToken();

        tokenRepository.save(EmailVerificationToken.builder()
                .tokenHash(hash(rawToken))
                .user(user)
                .expiryDate(Instant.now().plus(TOKEN_TTL_HOURS, ChronoUnit.HOURS))
                .used(false)
                .build());

        try {
            emailService.sendEmailVerificationEmail(
                    user.getEmail(),
                    frontendUrl + "/verify-email?token=" + rawToken);
        } catch (MailException ex) {
            log.warn("Verification email could not be sent to {}. Registration remains successful.", user.getEmail());
        }
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        EmailVerificationToken token = tokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification token"));
        if (token.isUsed() || token.isExpired()) {
            throw new IllegalArgumentException("Invalid or expired verification token");
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        token.setUsed(true);
        userRepository.save(user);
        tokenRepository.save(token);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            byte[] hashed = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
