ALTER TABLE orders DROP CONSTRAINT IF EXISTS chk_orders_status;

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_status
    CHECK (status IN ('INQUIRY', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'));

CREATE TABLE store_settings (
    id BIGINT NOT NULL PRIMARY KEY,
    mode VARCHAR(20) NOT NULL,
    CONSTRAINT chk_store_settings_mode CHECK (mode IN ('STORE', 'CATALOG'))
);

INSERT INTO store_settings (id, mode) VALUES (1, 'STORE');
