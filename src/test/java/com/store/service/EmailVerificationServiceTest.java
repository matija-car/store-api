package com.store.service;

import com.store.entity.EmailVerificationToken;
import com.store.entity.User;
import com.store.repository.EmailVerificationTokenRepository;
import com.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private EmailVerificationTokenRepository tokenRepository;
    @Mock private EmailService emailService;

    private EmailVerificationService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new EmailVerificationService(userRepository, tokenRepository, emailService);
        ReflectionTestUtils.setField(service, "frontendUrl", "https://shop.example.com");
        user = User.builder().id(1L).email("john@example.com").emailVerified(false).build();
    }

    @Test
    void issuesAndConsumesSingleUseVerificationToken() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        service.issueVerificationEmail(user.getEmail());

        ArgumentCaptor<String> linkCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendEmailVerificationEmail(eq(user.getEmail()), linkCaptor.capture());
        assertTrue(linkCaptor.getValue().startsWith("https://shop.example.com/verify-email?token="));

        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user)
                .expiryDate(Instant.now().plusSeconds(300))
                .used(false)
                .build();
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        service.verifyEmail("raw-token");

        assertTrue(user.isEmailVerified());
        assertTrue(token.isUsed());
        verify(userRepository).save(user);
        verify(tokenRepository).save(token);
    }

    @Test
    void rejectsExpiredVerificationToken() {
        EmailVerificationToken token = EmailVerificationToken.builder()
                .user(user)
                .expiryDate(Instant.now().minusSeconds(60))
                .used(false)
                .build();
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        assertThrows(IllegalArgumentException.class, () -> service.verifyEmail("raw-token"));
        assertFalse(user.isEmailVerified());
    }
}
