-- Products created before stock tracking was introduced had the column defaulted to zero.
-- Give those existing catalog products an initial unit of stock; later orders decrement it normally.
UPDATE products
SET stock_quantity = 1
WHERE stock_quantity = 0;
