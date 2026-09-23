ALTER TABLE products ADD COLUMN piece_type VARCHAR(20) NOT NULL DEFAULT 'PRINT';
ALTER TABLE products ADD CONSTRAINT chk_products_piece_type
    CHECK (piece_type IN ('ORIGINAL', 'PRINT'));
