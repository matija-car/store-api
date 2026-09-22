CREATE TABLE email_verification_tokens (
                                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                           token VARCHAR(255) NOT NULL,
                                           user_id BIGINT NOT NULL,
                                           expiry_date TIMESTAMP NOT NULL,
                                           CONSTRAINT fk_user_token FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);