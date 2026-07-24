CREATE DATABASE IF NOT EXISTS isogoods_db;
USE isogoods_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(100),
    variants TEXT,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_group_id VARCHAR(100),
    variant_name VARCHAR(100),
    quantity INT DEFAULT 1,
    status ENUM('pending', 'preparing', 'delivering', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'COD',
    order_type VARCHAR(50) DEFAULT 'Delivery',
    reservation_date DATE,
    reservation_time TIME,
    address TEXT,
    phone_number VARCHAR(20),
    proof_of_payment VARCHAR(255),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial Settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('gcash_number', '0995 870 2671'),
('gcash_qr_url', '');

-- Admin User
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Administrator', 'admin@isogoods.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Full Menu Data
INSERT INTO products (name, description, price, category, variants, note) VALUES
-- Pasta
('Carbonara', 'Creamy white sauce pasta with mushroom.', 99.00, 'Pasta', '[{"label":"W/ toasted bread","price":"99"},{"label":"W/ fries","price":"150"},{"label":"W/ fried chicken","price":"170"}]', NULL),
('Spaghetti', 'Classic sweet-style Filipino spaghetti.', 99.00, 'Pasta', '[{"label":"W/ toasted bread","price":"99"},{"label":"W/ fries","price":"150"},{"label":"W/ fried chicken","price":"170"}]', NULL),

-- Pancit or Bihon
('Pancit Bihon', 'Stir-fried rice noodles with vegetables.', 160.00, 'Pancit or Bihon', '[{"label":"Regular (Good for sharing)","price":"160"},{"label":"12\\" (Good for 6-8 pax)","price":"410"},{"label":"14\\" (Good for 10-12 pax)","price":"690"},{"label":"16\\" (Good for 14-16 pax)","price":"1040"}]', NULL),

-- Lomi
('Lomi', 'Thick egg noodle soup.', 160.00, 'Lomi', '[{"label":"Regular (Good for 2-3 pax)","price":"160"},{"label":"Overload (Good for 2-3 pax)","price":"280"}]', 'Overload includes: boiled egg, lechon kawali'),

-- Breakfast
('Java/plain rice', 'Daily breakfast rice meals.', 40.00, 'Breakfast', '[{"label":"Egg","price":"40"},{"label":"Siomai","price":"45"},{"label":"Ham","price":"55"},{"label":"Hotdog","price":"55"},{"label":"Spam","price":"60"},{"label":"Shanghai","price":"70"}]', NULL),

-- Sandwich
('Bang Sandwiches', 'Signature heavy-duty sandwiches.', 100.00, 'Sandwich', '[{"label":"Chick n Bang","price":"130"},{"label":"Spam n Bang","price":"100"},{"label":"Tuna n Bang","price":"100"},{"label":"Ham n cheese Bang","price":"100"},{"label":"Bacon n Bang","price":"110"}]', NULL),

-- Fries
('Fries', 'Crispy potato fries.', 55.00, 'Fries', '[{"label":"Regular","price":"55"},{"label":"Cheese","price":"65"},{"label":"Sour Cream","price":"65"},{"label":"BBQ","price":"65"},{"label":"Overload (2-3 pax)","price":"170"}]', NULL),

-- Lutong Bahay
('Pork Specialties', 'Traditional pork dishes.', 260.00, 'Lutong Bahay', '[{"label":"Nilagang Baboy","price":"260"},{"label":"Adobong Baboy","price":"260"},{"label":"Sinigang na Baboy","price":"260"},{"label":"Pork Menudo","price":"290"}]', 'Good for 2-3 pax'),
('Chicken Specialties', 'Traditional chicken dishes.', 240.00, 'Lutong Bahay', '[{"label":"Tinolang Manok","price":"240"},{"label":"Chicken Afritada","price":"240"},{"label":"Chicken Adobo","price":"240"}]', 'Good for 2-3 pax'),
('Extras & Veggies', 'Side dishes and vegetables.', 180.00, 'Lutong Bahay', '[{"label":"Lumpiang Shanghai (10pcs)","price":"230"},{"label":"Chopsuey (2-3 pax)","price":"180"}]', NULL),

-- Chix Rice Meal
('Flavored Chix Meal (4pcs)', 'Delicious chicken wings with rice.', 130.00, 'Chix Rice Meal', '[{"label":"Honey Butter","price":"130"},{"label":"Buffalo","price":"130"},{"label":"Barbeque","price":"130"},{"label":"Soy Garlic","price":"130"}]', 'Served with rice'),
('Fried Chix + Dip', 'Crispy fried chicken.', 65.00, 'Chix Rice Meal', '[{"label":"2 PCS chx + rice","price":"65"},{"label":"4 PCS chx + rice","price":"130"}]', NULL),
('Meal Extras', 'Add-ons for your meals.', 15.00, 'Chix Rice Meal', '[{"label":"Plain Rice","price":"15"},{"label":"Java Rice","price":"20"},{"label":"Tinapa (3 pax)","price":"80"}]', NULL),

-- Sizzling Plates
('Sizzling Plates', 'Sizzling hot plate meals.', 110.00, 'Sizzling Plates', '[{"label":"Lechon Kawali (Solo)","price":"120"},{"label":"Lechon Kawali (Platter)","price":"310"},{"label":"Pork Sisig (Solo)","price":"110"},{"label":"Pork Sisig (Platter)","price":"280"},{"label":"Chicken (Solo)","price":"110"}]', NULL),

-- Takoyaki
('Ham Takoyaki', 'Authentic Japanese Takoyaki with Ham.', 40.00, 'Takoyaki', '[{"label":"4 pcs","price":"40"},{"label":"28 pcs","price":"250"},{"label":"56 pcs","price":"490"},{"label":"4 pcs w/ Cheese","price":"50"},{"label":"28 pcs w/ Cheese","price":"325"},{"label":"56 pcs w/ Cheese","price":"640"}]', NULL),
('Cheese Takoyaki', 'Cheesy Takoyaki balls.', 40.00, 'Takoyaki', '[{"label":"4 pcs","price":"40"},{"label":"28 pcs","price":"250"},{"label":"56 pcs","price":"490"},{"label":"4 pcs Double Cheese","price":"50"},{"label":"28 pcs Double Cheese","price":"325"},{"label":"56 pcs Double Cheese","price":"640"}]', NULL),
('Bacon Takoyaki', 'Takoyaki with Bacon bits.', 45.00, 'Takoyaki', '[{"label":"4 pcs","price":"45"},{"label":"28 pcs","price":"285"},{"label":"56 pcs","price":"550"},{"label":"4 pcs w/ Cheese","price":"55"},{"label":"28 pcs w/ Cheese","price":"355"},{"label":"56 pcs w/ Cheese","price":"690"}]', NULL),

-- Beverages
('Lemonade', 'Refreshing Lemonade.', 45.00, 'Beverages', '[{"label":"Uno","price":"45"},{"label":"Dos","price":"55"}]', NULL),
('Milktea', 'Signature Milktea.', 39.00, 'Beverages', '[{"label":"Uno","price":"39"},{"label":"Dos","price":"49"}]', NULL),

-- Cold Brew
('Cold Brew Selection', 'Premium cold coffee selection.', 39.00, 'Cold Brew', '[{"label":"Iced Americano","price":"39"},{"label":"Latte","price":"59"},{"label":"Mocha","price":"59"},{"label":"Macchiato","price":"59"},{"label":"Americano Frappe","price":"59"},{"label":"Frappuccino","price":"59"},{"label":"Cafe Late Frappe","price":"59"},{"label":"Mocchaccino","price":"59"}]', NULL),

-- Dessert
('Sweet Treats', 'End your meal with something sweet.', 85.00, 'Dessert', '[{"label":"Special Halo-Halo","price":"85"},{"label":"Leche Flan","price":"100"}]', NULL),

-- Shake
('Fresh Shakes', 'Fruit and dessert shakes.', 69.00, 'Shake', '[{"label":"Mango Shake","price":"69"},{"label":"Strawberry Shake","price":"69"},{"label":"Avocado Shake","price":"69"},{"label":"Chocolate Shake","price":"69"},{"label":"Java Chip Shake","price":"69"},{"label":"Cheesecake Shake","price":"69"}]', NULL),

-- Bilao
('Flavored Chicken (Bilao)', 'Party-sized chicken wings.', 650.00, 'Bilao', '[{"label":"24 pcs","price":"650"},{"label":"35 pcs","price":"950"},{"label":"48 pcs","price":"1260"}]', NULL),
('Spaghetti (Bilao)', 'Party-sized Spaghetti.', 845.00, 'Bilao', '[{"label":"Medium (10 pax)","price":"845"},{"label":"Large (14 pax)","price":"1295"}]', NULL),
('Carbonara (Bilao)', 'Party-sized Carbonara.', 845.00, 'Bilao', '[{"label":"Medium (10 pax)","price":"845"},{"label":"Large (14 pax)","price":"1295"}]', NULL);
