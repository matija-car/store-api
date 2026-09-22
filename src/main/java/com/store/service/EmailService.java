package com.store.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendPasswordResetEmail(String email, String resetLink) {
        // TODO: Replace this stub with a transactional email provider integration.
        log.debug("Password reset email delivery is not configured for {}", email);
    }
}
