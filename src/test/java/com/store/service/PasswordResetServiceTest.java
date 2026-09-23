package com.store.service;

import com.store.entity.PasswordResetToken;
import com.store.entity.User;
import com.store.repository.PasswordResetTokenRepository;
import com.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordResetTokenRepository tokenRepository;
    @Mock private RefreshTokenService refreshTokenService;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;

    private PasswordResetService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new PasswordResetService(
                userRepository, tokenRepository, refreshTokenService, passwordEncoder, emailService);
        ReflectionTestUtils.setField(service, "frontendUrl", "https://shop.example.com");
        user = User.builder().id(1L).email("john@example.com").password("old").build();
    }

    @Test
    void unknownEmailDoesNotRevealAccount() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> service.requestReset("missing@example.com"));
        verifyNoInteractions(emailService, tokenRepository);
    }

    @Test
    void usedTokenIsRejected() {
        PasswordResetToken token = PasswordResetToken.builder()
                .user(user).tokenHash("hash").expiryDate(Instant.now().plusSeconds(60)).used(true).build();
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        assertThrows(IllegalArgumentException.class, () -> service.resetPassword("raw", "new"));
    }

    @Test
    void expiredTokenIsRejected() {
        PasswordResetToken token = PasswordResetToken.builder()
                .user(user).tokenHash("hash").expiryDate(Instant.now().minusSeconds(60)).used(false).build();
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        assertThrows(IllegalArgumentException.class, () -> service.resetPassword("raw", "new"));
    }

    @Test
    void successfulResetRevokesAllRefreshTokens() {
        PasswordResetToken token = PasswordResetToken.builder()
                .user(user).tokenHash("hash").expiryDate(Instant.now().plusSeconds(60)).used(false).build();
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("new")).thenReturn("encoded");

        service.resetPassword("raw", "new");

        assertEquals("encoded", user.getPassword());
        assertTrue(token.isUsed());
        verify(refreshTokenService).revokeAllForUser(user);
    }
}
