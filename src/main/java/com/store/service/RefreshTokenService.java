package com.store.service;

import com.store.entity.RefreshToken;
import com.store.entity.User;
import com.store.repository.RefreshTokenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Bare minimum for now: just enough for PasswordResetService to kill a
 * user's sessions on password reset. Issuing/validating/rotating refresh
 * tokens for the actual login flow is the next step, not done here yet.
 */
@Service
@AllArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public void revokeAllForUser(User user) {
        List<RefreshToken> tokens = refreshTokenRepository.findAllByUserAndRevokedFalse(user);
        tokens.forEach(t -> t.setRevoked(true));
        refreshTokenRepository.saveAll(tokens);
        log.info("Revoked {} refresh token(s) for user id {}", tokens.size(), user.getId());
    }
}