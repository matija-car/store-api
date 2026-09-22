-- Dodavanje kolone created_at ako već ne postoji
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Osiguravanje da postoji kolona image_url
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Unos proizvoda s pouzdanim Unsplash URL-ovima
INSERT INTO products (name, description, price, category_id, image_url, created_at) VALUES
                                                                                        ('Zalazak Sunca nad Morem', 'Originalno ulje na platnu, dimenzije 80x60 cm. Rad iz 2025. godine.', 450.00, 1, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675', NOW()),
                                                                                        ('Planinski Pejzaž u Magli', 'Akril na kvalitetnom pamučnom platnu, 100x70 cm.', 380.00, 2, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119', NOW()),
                                                                                        ('Abstraktna Harmonija', 'Moderna apstraktna slika s bogatim teksturama, 90x90 cm.', 520.00, 2, 'https://images.unsplash.com/photo-1541701494587-cb58502866ab', NOW()),
                                                                                        ('Proljeće u Cvatu', 'Nježni akvarel na 300g papiru, uokvireno s paspartuom.', 180.00, 3, 'https://images.unsplash.com/photo-1582562124811-c09040d0a901', NOW()),
                                                                                        ('Brončani Letač', 'Unikatna brončana skulptura na mramornom postolju, visina 35 cm.', 890.00, 4, 'https://images.unsplash.com/photo-1544411047-c491e34a24e0', NOW());