/**
 * Car Rental Pro - Storage Operations
 * R2 Storage helper functions for image upload/delete
 */

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const handleStorage = {
    /**
     * Upload image to R2
     */
    async upload(request, env) {
        try {
            const formData = await request.formData();
            const file = formData.get('image');
            const carId = formData.get('carId');

            if (!file) {
                return jsonResponse({ error: 'No image provided' }, 400);
            }

            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                return jsonResponse({
                    error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF'
                }, 400);
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                return jsonResponse({
                    error: 'File too large. Maximum size: 5MB'
                }, 400);
            }

            // Generate unique key
            const ext = file.name.split('.').pop() || 'jpg';
            const key = `cars/${carId || 'temp'}/${Date.now()}-${randomString(8)}.${ext}`;

            // Upload to R2
            await env.R2.put(key, file.stream(), {
                httpMetadata: {
                    contentType: file.type
                },
                customMetadata: {
                    originalName: file.name,
                    carId: carId || ''
                }
            });

            // Get public URL (you need to configure public access or use a custom domain)
            const imageUrl = `https://pub-xxxxx.r2.dev/${key}`; // Replace with your R2 public URL

            return jsonResponse({
                success: true,
                key: key,
                url: imageUrl,
                message: 'Image uploaded successfully'
            });

        } catch (error) {
            console.error('Upload error:', error);
            return jsonResponse({ error: 'Upload failed', message: error.message }, 500);
        }
    },

    /**
     * Delete image from R2
     */
    async delete(key, env) {
        try {
            await env.R2.delete(key);
            return jsonResponse({
                success: true,
                message: 'Image deleted successfully'
            });
        } catch (error) {
            console.error('Delete error:', error);
            return jsonResponse({ error: 'Delete failed', message: error.message }, 500);
        }
    },

    /**
     * Get image from R2
     */
    async get(key, env) {
        try {
            const object = await env.R2.get(key);

            if (!object) {
                return new Response('Image not found', { status: 404 });
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set('Cache-Control', 'public, max-age=31536000');

            return new Response(object.body, { headers });

        } catch (error) {
            console.error('Get error:', error);
            return new Response('Error retrieving image', { status: 500 });
        }
    },

    /**
     * List images for a car
     */
    async list(carId, env) {
        try {
            const prefix = `cars/${carId}/`;
            const listed = await env.R2.list({ prefix });

            return jsonResponse({
                images: listed.objects.map(obj => ({
                    key: obj.key,
                    size: obj.size,
                    uploaded: obj.uploaded
                }))
            });

        } catch (error) {
            console.error('List error:', error);
            return jsonResponse({ error: 'List failed', message: error.message }, 500);
        }
    }
};

// Helper functions
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

function randomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
