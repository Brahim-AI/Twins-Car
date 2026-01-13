/**
 * Car Rental Pro - Main API Router
 * Cloudflare Worker Entry Point
 */

import { handleDatabase } from './database.js';
import { handleStorage } from './storage.js';

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Main request handler
export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // API Routes
            if (path.startsWith('/api/')) {
                return await handleAPIRequest(request, env, path);
            }

            // Health check
            if (path === '/health') {
                return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
            }

            // 404 for unknown routes
            return jsonResponse({ error: 'Not Found' }, 404);

        } catch (error) {
            console.error('Error:', error);
            return jsonResponse({ error: 'Internal Server Error', message: error.message }, 500);
        }
    }
};

// API Request Handler
async function handleAPIRequest(request, env, path) {
    const method = request.method;

    // Cars endpoints
    if (path === '/api/cars') {
        if (method === 'GET') {
            return await getCars(request, env);
        }
        if (method === 'POST') {
            return await createCar(request, env);
        }
    }

    // Single car endpoints
    const carMatch = path.match(/^\/api\/cars\/(\d+)$/);
    if (carMatch) {
        const carId = parseInt(carMatch[1]);
        if (method === 'GET') {
            return await getCarById(carId, env);
        }
        if (method === 'PUT') {
            return await updateCar(carId, request, env);
        }
        if (method === 'DELETE') {
            return await deleteCar(carId, env);
        }
    }

    // Image upload
    if (path === '/api/upload' && method === 'POST') {
        return await handleStorage.upload(request, env);
    }

    // Image delete
    const imageMatch = path.match(/^\/api\/images\/(.+)$/);
    if (imageMatch && method === 'DELETE') {
        return await handleStorage.delete(imageMatch[1], env);
    }

    // Admin login
    if (path === '/api/admin/login' && method === 'POST') {
        return await adminLogin(request, env);
    }

    // Settings
    if (path === '/api/settings') {
        if (method === 'GET') {
            return await getSettings(env);
        }
        if (method === 'PUT') {
            return await updateSettings(request, env);
        }
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);
}

// ============================================
// CARS HANDLERS
// ============================================

async function getCars(request, env) {
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    const fuel = url.searchParams.get('fuel');
    const transmission = url.searchParams.get('transmission');
    const maxPrice = url.searchParams.get('maxPrice');
    const year = url.searchParams.get('year');
    const status = url.searchParams.get('status');

    let query = 'SELECT * FROM cars WHERE 1=1';
    const params = [];

    if (brand) {
        query += ' AND LOWER(brand) = ?';
        params.push(brand.toLowerCase());
    }
    if (fuel) {
        query += ' AND fuel = ?';
        params.push(fuel);
    }
    if (transmission) {
        query += ' AND transmission = ?';
        params.push(transmission);
    }
    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
    }
    if (year) {
        query += ' AND year = ?';
        params.push(parseInt(year));
    }
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await handleDatabase.query(env.DB, query, params);

    // Get images for each car
    for (let car of result) {
        const images = await handleDatabase.query(
            env.DB,
            'SELECT * FROM car_images WHERE car_id = ? ORDER BY is_primary DESC',
            [car.id]
        );
        car.images = images;
        car.image = images.length > 0 ? images[0].image_url : null;
    }

    return jsonResponse(result);
}

async function getCarById(carId, env) {
    const cars = await handleDatabase.query(
        env.DB,
        'SELECT * FROM cars WHERE id = ?',
        [carId]
    );

    if (cars.length === 0) {
        return jsonResponse({ error: 'Car not found' }, 404);
    }

    const car = cars[0];

    // Get images
    car.images = await handleDatabase.query(
        env.DB,
        'SELECT * FROM car_images WHERE car_id = ?',
        [carId]
    );
    car.image = car.images.length > 0 ? car.images[0].image_url : null;

    return jsonResponse(car);
}

async function createCar(request, env) {
    const data = await request.json();

    const result = await handleDatabase.run(
        env.DB,
        `INSERT INTO cars (brand, model, year, price, fuel, transmission, seats, color, description, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.brand,
            data.model,
            data.year,
            data.price,
            data.fuel || 'petrol',
            data.transmission || 'automatic',
            data.seats || 5,
            data.color || null,
            data.description || null,
            data.status || 'available'
        ]
    );

    return jsonResponse({ id: result.lastRowId, message: 'Car created successfully' }, 201);
}

async function updateCar(carId, request, env) {
    const data = await request.json();

    await handleDatabase.run(
        env.DB,
        `UPDATE cars SET 
            brand = ?, model = ?, year = ?, price = ?, 
            fuel = ?, transmission = ?, seats = ?, 
            color = ?, description = ?, status = ?,
            updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
            data.brand,
            data.model,
            data.year,
            data.price,
            data.fuel,
            data.transmission,
            data.seats,
            data.color,
            data.description,
            data.status,
            carId
        ]
    );

    return jsonResponse({ message: 'Car updated successfully' });
}

async function deleteCar(carId, env) {
    // Delete images from R2 first
    const images = await handleDatabase.query(
        env.DB,
        'SELECT image_key FROM car_images WHERE car_id = ?',
        [carId]
    );

    for (const img of images) {
        await handleStorage.delete(img.image_key, env);
    }

    // Delete car (cascade will delete image records)
    await handleDatabase.run(env.DB, 'DELETE FROM cars WHERE id = ?', [carId]);

    return jsonResponse({ message: 'Car deleted successfully' });
}

// ============================================
// ADMIN HANDLERS
// ============================================

async function adminLogin(request, env) {
    const { username, password } = await request.json();

    // Simple auth (in production, use proper password hashing)
    const admins = await handleDatabase.query(
        env.DB,
        'SELECT * FROM admins WHERE username = ?',
        [username]
    );

    if (admins.length === 0) {
        return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    // In production, verify hashed password
    // For demo, accept simple password check
    if (password === 'admin123') {
        // Update last login
        await handleDatabase.run(
            env.DB,
            'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [admins[0].id]
        );

        // Generate simple token (use JWT in production)
        const token = btoa(`${username}:${Date.now()}`);

        return jsonResponse({ token, message: 'Login successful' });
    }

    return jsonResponse({ error: 'Invalid credentials' }, 401);
}

// ============================================
// SETTINGS HANDLERS
// ============================================

async function getSettings(env) {
    const settings = await handleDatabase.query(env.DB, 'SELECT * FROM settings', []);
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    return jsonResponse(result);
}

async function updateSettings(request, env) {
    const data = await request.json();

    for (const [key, value] of Object.entries(data)) {
        await handleDatabase.run(
            env.DB,
            `INSERT OR REPLACE INTO settings (key, value, updated_at) 
             VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [key, value]
        );
    }

    return jsonResponse({ message: 'Settings updated' });
}

// ============================================
// HELPERS
// ============================================

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}
