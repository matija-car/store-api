ALTER TABLE email_verification_tokens RENAME COLUMN token TO token_hash;
ALTER TABLE email_verification_tokens ADD COLUMN used BOOLEAN NOT NULL DEFAULT FALSE;
