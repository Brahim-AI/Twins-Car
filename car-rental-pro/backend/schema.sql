-- Car Rental Pro - Database Schema
-- Run: wrangler d1 execute car-rental-db --file=./schema.sql

-- Cars Table
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price REAL NOT NULL,
    fuel TEXT DEFAULT 'petrol',
    transmission TEXT DEFAULT 'automatic',
    seats INTEGER DEFAULT 5,
    color TEXT,
    description TEXT,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Car Images Table (for multiple images per car)
CREATE TABLE IF NOT EXISTS car_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    image_key TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);

-- Insert default admin (password: admin123 - hashed)
-- In production, use: wrangler secret put ADMIN_PASSWORD
INSERT OR IGNORE INTO admins (username, password_hash) 
VALUES ('admin', '$2a$10$xxxxxxxxxxx');

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES 
    ('whatsapp', '+212600000000'),
    ('email', 'info@carrentalpro.ma'),
    ('phone', '+212600000000'),
    ('address', 'الدار البيضاء، المغرب');

-- Sample data for testing
INSERT OR IGNORE INTO cars (brand, model, year, price, fuel, transmission, seats, color, status, description) VALUES
    ('Mercedes-Benz', 'E-Class', 2024, 800, 'petrol', 'automatic', 5, 'أسود', 'available', 'مرسيدس E-Class الفاخرة'),
    ('BMW', 'X5', 2023, 900, 'diesel', 'automatic', 7, 'أبيض', 'available', 'BMW X5 الرياضية'),
    ('Audi', 'A6', 2024, 750, 'petrol', 'automatic', 5, 'رمادي', 'rented', 'أودي A6 الأنيقة'),
    ('Toyota', 'Camry', 2023, 400, 'hybrid', 'automatic', 5, 'فضي', 'available', 'تويوتا كامري الهجينة');
