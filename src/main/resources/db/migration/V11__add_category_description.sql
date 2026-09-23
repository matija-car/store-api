ALTER TABLE categories ADD COLUMN description VARCHAR(255);

ALTER TABLE products DROP CONSTRAINT fk_products_categories;

ALTER TABLE categories ALTER COLUMN id TYPE BIGINT;
ALTER TABLE products ALTER COLUMN category_id TYPE BIGINT;

ALTER TABLE products
    ADD CONSTRAINT fk_products_categories
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL;
