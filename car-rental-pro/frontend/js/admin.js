/**
 * Car Rental Pro - Admin JavaScript
 * Handles admin authentication, car management (CRUD)
 */

// API Configuration
const API_BASE_URL = 'https://your-worker.your-subdomain.workers.dev/api';

// State
let isAuthenticated = false;
let cars = [];
let currentCarId = null;
let uploadedImages = [];

// DOM Elements - Login
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const adminDashboard = document.getElementById('adminDashboard');

// DOM Elements - Navigation
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const adminPages = document.querySelectorAll('.admin-page');
const logoutBtn = document.getElementById('logoutBtn');
const pageTitle = document.getElementById('pageTitle');

// DOM Elements - Car Form
const carForm = document.getElementById('carForm');
const uploadZone = document.getElementById('uploadZone');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const cancelForm = document.getElementById('cancelForm');

// DOM Elements - Cars Table
const carsTableBody = document.getElementById('carsTableBody');

// DOM Elements - Stats
const statTotal = document.getElementById('statTotal');
const statAvailable = document.getElementById('statAvailable');
const statRented = document.getElementById('statRented');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (token) {
        isAuthenticated = true;
        showDashboard();
        loadData();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login form
    loginForm?.addEventListener('submit', handleLogin);

    // Logout
    logoutBtn?.addEventListener('click', handleLogout);

    // Mobile Menu Toggle
    const adminMenuToggle = document.getElementById('adminMenuToggle');
    const adminSidebar = document.querySelector('.admin-sidebar');

    adminMenuToggle?.addEventListener('click', () => {
        adminSidebar?.classList.toggle('open');
        // Create/toggle overlay
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('active');

        // Close on overlay click
        overlay.addEventListener('click', () => {
            adminSidebar?.classList.remove('open');
            overlay.classList.remove('active');
        });
    });

    // Navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
            // Close mobile sidebar after navigation
            adminSidebar?.classList.remove('open');
            document.querySelector('.sidebar-overlay')?.classList.remove('active');
        });
    });

    // Also handle navigation buttons with data-page
    document.querySelectorAll('[data-page]').forEach(el => {
        if (!el.classList.contains('sidebar-link')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(el.dataset.page);
            });
        }
    });

    // Car form
    carForm?.addEventListener('submit', handleCarSubmit);
    cancelForm?.addEventListener('click', () => navigateTo('cars'));

    // Image upload
    uploadZone?.addEventListener('click', () => imageInput?.click());
    uploadZone?.addEventListener('dragover', handleDragOver);
    uploadZone?.addEventListener('drop', handleDrop);
    imageInput?.addEventListener('change', handleImageSelect);
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Demo authentication (replace with real API call)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_token', 'demo_token_12345');
        isAuthenticated = true;
        loginError?.classList.add('hidden');
        showDashboard();
        loadData();
        showToast('Login successful', 'success');
    } else {
        loginError?.classList.remove('hidden');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('admin_token');
    isAuthenticated = false;
    loginOverlay?.classList.remove('hidden');
    adminDashboard?.classList.add('hidden');
    showToast('Logged out successfully', 'info');
}

// Show Dashboard
function showDashboard() {
    loginOverlay?.classList.add('hidden');
    adminDashboard?.classList.remove('hidden');
}

// Navigate to Page
function navigateTo(pageName) {
    // Update sidebar
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });

    // Update pages
    adminPages.forEach(page => {
        page.classList.toggle('active', page.id === `page-${pageName}`);
    });

    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'cars': 'Manage Cars',
        'add-car': currentCarId ? 'Edit Car' : 'Add New Car'
    };
    if (pageTitle) pageTitle.textContent = titles[pageName] || pageName;

    // Reset form if navigating to add-car
    if (pageName === 'add-car' && !currentCarId) {
        resetCarForm();
    }
}

// Load Data
async function loadData() {
    try {
        const response = await fetch(`${API_BASE_URL}/cars`);
        if (response.ok) {
            cars = await response.json();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.log('Using demo data');
        cars = getDemoData();
    }

    updateStats();
    renderCarsTable();
}

// Update Stats
function updateStats() {
    const total = cars.length;
    const available = cars.filter(c => c.status === 'available').length;
    const rented = cars.filter(c => c.status === 'rented').length;

    if (statTotal) statTotal.textContent = total;
    if (statAvailable) statAvailable.textContent = available;
    if (statRented) statRented.textContent = rented;
}

// Render Cars Table
function renderCarsTable() {
    if (!carsTableBody) return;

    carsTableBody.innerHTML = cars.map(car => `
        <tr>
            <td><img src="${car.image || 'https://via.placeholder.com/60x40'}" alt="${car.brand}"></td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.price} DH</td>
            <td>
                <span class="status-badge ${car.status}">
                    ${car.status === 'available' ? 'Available' : 'Rented'}
                </span>
            </td>
            <td class="actions">
                <button class="btn-edit" onclick="editCar(${car.id})">
                    <span class="material-icons-round">edit</span>
                </button>
                <button class="btn-delete" onclick="deleteCar(${car.id})">
                    <span class="material-icons-round">delete</span>
                </button>
            </td>
        </tr>
    `).join('');
}

// Handle Car Form Submit
async function handleCarSubmit(e) {
    e.preventDefault();

    const carData = {
        id: currentCarId || Date.now(),
        brand: document.getElementById('carBrand').value,
        model: document.getElementById('carModel').value,
        year: parseInt(document.getElementById('carYear').value),
        price: parseInt(document.getElementById('carPrice').value),
        fuel: document.getElementById('carFuel').value,
        transmission: document.getElementById('carTransmission').value,
        status: 'available',
        image: uploadedImages[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'
    };

    try {
        if (currentCarId) {
            // Update existing car
            const index = cars.findIndex(c => c.id === currentCarId);
            if (index !== -1) {
                cars[index] = { ...cars[index], ...carData };
            }
            showToast('Car updated successfully', 'success');
        } else {
            // Add new car
            cars.push(carData);
            showToast('Car added successfully', 'success');
        }

        updateStats();
        renderCarsTable();
        resetCarForm();
        navigateTo('cars');
    } catch (error) {
        showToast('An error occurred, please try again', 'error');
    }
}

// Edit Car
function editCar(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    currentCarId = carId;

    document.getElementById('carBrand').value = car.brand.toLowerCase();
    document.getElementById('carModel').value = car.model;
    document.getElementById('carYear').value = car.year;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carFuel').value = car.fuel;
    document.getElementById('carTransmission').value = car.transmission;

    navigateTo('add-car');
}

// Delete Car
function deleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) return;

    cars = cars.filter(c => c.id !== carId);
    updateStats();
    renderCarsTable();
    showToast('Car deleted successfully', 'success');
}

// Reset Car Form
function resetCarForm() {
    currentCarId = null;
    carForm?.reset();
    uploadedImages = [];
    if (imagePreview) imagePreview.innerHTML = '';
}

// Image Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadZone?.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadZone?.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleImageSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push(e.target.result);
            renderImagePreview();
        };
        reader.readAsDataURL(file);
    });
}

function renderImagePreview() {
    if (!imagePreview) return;

    imagePreview.innerHTML = uploadedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview">
            <button type="button" onclick="removeImage(${index})">
                <span class="material-icons-round">close</span>
            </button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreview();
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="material-icons-round">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
        <span>${message}</span>
    `;

    toastContainer?.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Demo Data
function getDemoData() {
    return [
        { id: 1, brand: 'Mercedes-Benz', model: 'E-Class', year: 2024, price: 800, fuel: 'petrol', transmission: 'automatic', status: 'available', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400' },
        { id: 2, brand: 'BMW', model: 'X5', year: 2023, price: 900, fuel: 'diesel', transmission: 'automatic', status: 'available', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' },
        { id: 3, brand: 'Audi', model: 'A6', year: 2024, price: 750, fuel: 'petrol', transmission: 'automatic', status: 'rented', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400' },
        { id: 4, brand: 'Toyota', model: 'Camry', year: 2023, price: 400, fuel: 'hybrid', transmission: 'automatic', status: 'available', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' },
    ];
}

// Make functions available globally for onclick handlers
window.editCar = editCar;
window.deleteCar = deleteCar;
window.removeImage = removeImage;
