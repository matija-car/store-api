package com.store.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendPasswordResetEmail(String email, String resetLink) {
        // Replace this sender with a transactional email API adapter if desired.
        // Reviewed: recipient and subject use JavaMail's structured API; no raw headers or user input enter the subject.
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email);
        message.setSubject("Reset your password");
        message.setText("Use the following link to reset your password:\n\n" + resetLink);
        mailSender.send(message);
    }

    public void sendEmailVerificationEmail(String email, String verificationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email);
        message.setSubject("Verify your email address");
        message.setText("Use the following link to verify your email address:\n\n" + verificationLink);
        mailSender.send(message);
    }
}
