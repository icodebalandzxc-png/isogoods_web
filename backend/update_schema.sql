-- Update script for 50% Deposit and Balance Tracking feature

USE isogoods_db;

-- Add financial tracking columns to orders table if they don't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) AFTER reservation_time,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10, 2) AFTER total_amount,
ADD COLUMN IF NOT EXISTS balance_amount DECIMAL(10, 2) AFTER amount_paid;

-- Note: 'IF NOT EXISTS' for columns is supported in MariaDB and newer MySQL.
-- For older MySQL, you would use:
-- ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2) AFTER reservation_time;
-- ALTER TABLE orders ADD COLUMN amount_paid DECIMAL(10, 2) AFTER total_amount;
-- ALTER TABLE orders ADD COLUMN balance_amount DECIMAL(10, 2) AFTER amount_paid;
