-- Users table
CREATE TABLE users (
                       id       BIGINT AUTO_INCREMENT NOT NULL,
                       name     VARCHAR(255) NOT NULL,
                       email    VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       CONSTRAINT pk_users PRIMARY KEY (id)
);

-- Categories table
CREATE TABLE categories (
                            id   INT AUTO_INCREMENT NOT NULL,
                            name VARCHAR(255) NOT NULL UNIQUE,
                            CONSTRAINT pk_categories PRIMARY KEY (id)
);

-- Products table
CREATE TABLE products (
                          id          BIGINT AUTO_INCREMENT NOT NULL,
                          name        VARCHAR(255)   NOT NULL,
                          price       DECIMAL(10, 2) NOT NULL CHECK (price > 0),
                          description TEXT           NOT NULL,
                          category_id INT            NULL,
                          CONSTRAINT pk_products PRIMARY KEY (id),
                          CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
);

-- Addresses table
CREATE TABLE addresses (
                           id      BIGINT AUTO_INCREMENT NOT NULL,
                           street  VARCHAR(255) NOT NULL,
                           city    VARCHAR(255) NOT NULL,
                           state   VARCHAR(255) NOT NULL,
                           zip     VARCHAR(20)  NOT NULL,
                           user_id BIGINT       NOT NULL,
                           CONSTRAINT pk_addresses PRIMARY KEY (id),
                           CONSTRAINT fk_addresses_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Profiles table
CREATE TABLE profiles (
                          id             BIGINT NOT NULL,
                          bio            TEXT   NULL,
                          phone_number   VARCHAR(20) NULL,
                          date_of_birth  DATE   NULL,
                          loyalty_points INT DEFAULT 0 NULL,
                          CONSTRAINT pk_profiles PRIMARY KEY (id),
                          CONSTRAINT fk_profiles_users FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
);

-- Wishlist table (many-to-many relationship)
CREATE TABLE wishlist (
                          product_id BIGINT NOT NULL,
                          user_id    BIGINT NOT NULL,
                          CONSTRAINT pk_wishlist PRIMARY KEY (product_id, user_id),
                          CONSTRAINT fk_wishlist_products FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
                          CONSTRAINT fk_wishlist_users FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);

-- Insert sample data
INSERT INTO categories (name) VALUES ('Electronics');
INSERT INTO categories (name) VALUES ('Books');
INSERT INTO categories (name) VALUES ('Clothing');
INSERT INTO categories (name) VALUES ('Furniture');
INSERT INTO categories (name) VALUES ('Sports');

-- Insert sample products
INSERT INTO products (name, price, description, category_id) VALUES
    ('Laptop', 999.99, 'High performance laptop for developers', 1);

INSERT INTO products (name, price, description, category_id) VALUES
    ('Wireless Mouse', 29.99, 'Comfortable wireless mouse for office use', 1);

INSERT INTO products (name, price, description, category_id) VALUES
    ('Clean Code Book', 49.99, 'A handbook of agile software craftsmanship', 2);

INSERT INTO products (name, price, description, category_id) VALUES
    ('Office Desk', 299.99, 'Large wooden office desk with storage', 4);

INSERT INTO products (name, price, description, category_id) VALUES
    ('Running Shoes', 119.99, 'Professional running shoes for athletes', 5);