package com.store.service;

import com.store.entity.RefreshToken;
import com.store.entity.User;
import com.store.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    private RefreshTokenService refreshTokenService;
    private User user;

    @BeforeEach
    void setUp() {
        refreshTokenService = new RefreshTokenService(refreshTokenRepository);
        user = User.builder().id(7L).email("john@example.com").build();
    }

    @Test
    void reusedRotatedTokenRevokesAllOtherActiveTokens() {
        RefreshToken rotated = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plusSeconds(300))
                .revoked(false)
                .build();
        RefreshToken unrelated = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plusSeconds(300))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(rotated));
        when(refreshTokenRepository.findAllByUserAndRevokedFalse(user))
                .thenReturn(List.of(unrelated));

        String rawToken = refreshTokenService.issueToken(user);
        assertSame(user, refreshTokenService.rotateToken(rawToken));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> refreshTokenService.rotateToken(rawToken));

        assertEquals("Invalid or expired refresh token", exception.getMessage());
        assertTrue(rotated.isRevoked());
        assertTrue(unrelated.isRevoked());
        verify(refreshTokenRepository).saveAll(List.of(unrelated));
    }

    @Test
    void issueRotateAndRevokeHappyPaths() {
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plusSeconds(300))
                .revoked(false)
                .build();
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        String rawToken = refreshTokenService.issueToken(user);
        assertNotNull(rawToken);
        assertSame(user, refreshTokenService.rotateToken(rawToken));
        assertTrue(token.isRevoked());

        token.setRevoked(false);
        refreshTokenService.revokeToken(rawToken);
        assertTrue(token.isRevoked());
    }
}
