/**
 * Car Rental Pro - Main JavaScript
 * Handles car display, filtering, and user interactions
 */

// API Configuration
const API_BASE_URL = 'https://your-worker.your-subdomain.workers.dev/api';

// State
let cars = [];
let filteredCars = [];
let currentPage = 1;
const carsPerPage = 9;

// DOM Elements
const carsGrid = document.getElementById('carsGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const carModal = document.getElementById('carModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

// Filter Elements
const filterBrand = document.getElementById('filterBrand');
const filterFuel = document.getElementById('filterFuel');
const filterTransmission = document.getElementById('filterTransmission');
const filterPrice = document.getElementById('filterPrice');
const filterYear = document.getElementById('filterYear');
const priceValue = document.getElementById('priceValue');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');

// Language Switch Elements
const langSwitcher = document.getElementById('langSwitcher');
const langCurrentBtn = document.getElementById('langCurrentBtn');
const langDropdown = document.getElementById('langDropdown');

// Translations
const translations = {
    en: {
        'nav-cars': 'Cars',
        'nav-about': 'About Us',
        'nav-contact': 'Contact Us',
        'hero-title-line1': 'Discover',
        'hero-title-line2': 'the Finest Cars',
        'hero-title-line3': 'for Rent',
        'hero-subtitle': 'Enjoy an exceptional driving experience with the latest luxury car models',
        'stat-cars': 'Available Cars',
        'stat-service': 'Customer Service',
        'stat-satisfaction': 'Customer Satisfaction',
        'filter-title': 'Find Your Perfect Car',
        'filter-brand': 'Brand',
        'option-all-brands': 'All Brands',
        'filter-fuel': 'Fuel Type',
        'option-all-types': 'All Types',
        'option-petrol': 'Petrol',
        'option-diesel': 'Diesel',
        'option-electric': 'Electric',
        'option-hybrid': 'Hybrid',
        'filter-transmission': 'Transmission',
        'option-all': 'All',
        'option-automatic': 'Automatic',
        'option-manual': 'Manual',
        'filter-price': 'Price (DH/day)',
        'filter-year': 'Year',
        'option-all-years': 'All Years',
        'btn-search': 'Search',
        'btn-reset': 'Reset',
        'cars-title': 'Available Cars',
        'loading-text': 'Loading cars...',
        'empty-title': 'No cars available',
        'empty-text': 'Try changing your search criteria',
        'load-more': 'Load More',
        'footer-desc': 'Best luxury car rental service in Morocco',
        'footer-quick-links': 'Quick Links',
        'footer-cars': 'Cars',
        'footer-about': 'About Us',
        'footer-contact': 'Contact Us',
        'footer-contact-us': 'Contact Us',
        'footer-follow': 'Follow Us',
        'fuel-type': 'Fuel Type',
        'transmission': 'Transmission',
        'seats': 'Seats',
        'color': 'Color',
        'price': 'Price',
        'book-now': 'Book Now',
        'available': 'Available',
        'rented': 'Rented',
        'day': '/day'
    },
    fr: {
        'nav-cars': 'Voitures',
        'nav-about': 'À propos',
        'nav-contact': 'Contact',
        'hero-title-line1': 'Découvrez',
        'hero-title-line2': 'les Meilleures Voitures',
        'hero-title-line3': 'à Louer',
        'hero-subtitle': 'Profitez d\'une expérience de conduite exceptionnelle avec les derniers modèles de voitures de luxe',
        'stat-cars': 'Voitures Disponibles',
        'stat-service': 'Service Client',
        'stat-satisfaction': 'Satisfaction Client',
        'filter-title': 'Trouvez Votre Voiture Idéale',
        'filter-brand': 'Marque',
        'option-all-brands': 'Toutes les Marques',
        'filter-fuel': 'Type de Carburant',
        'option-all-types': 'Tous les Types',
        'option-petrol': 'Essence',
        'option-diesel': 'Diesel',
        'option-electric': 'Électrique',
        'option-hybrid': 'Hybride',
        'filter-transmission': 'Transmission',
        'option-all': 'Tous',
        'option-automatic': 'Automatique',
        'option-manual': 'Manuelle',
        'filter-price': 'Prix (DH/jour)',
        'filter-year': 'Année',
        'option-all-years': 'Toutes les Années',
        'btn-search': 'Rechercher',
        'btn-reset': 'Réinitialiser',
        'cars-title': 'Voitures Disponibles',
        'loading-text': 'Chargement des voitures...',
        'empty-title': 'Aucune voiture disponible',
        'empty-text': 'Essayez de modifier vos critères de recherche',
        'load-more': 'Charger Plus',
        'footer-desc': 'Meilleur service de location de voitures de luxe au Maroc',
        'footer-quick-links': 'Liens Rapides',
        'footer-cars': 'Voitures',
        'footer-about': 'À propos',
        'footer-contact': 'Contact',
        'footer-contact-us': 'Contactez-nous',
        'footer-follow': 'Suivez-nous',
        'fuel-type': 'Type de Carburant',
        'transmission': 'Transmission',
        'seats': 'Places',
        'color': 'Couleur',
        'price': 'Prix',
        'book-now': 'Réserver',
        'available': 'Disponible',
        'rented': 'Louée',
        'day': '/jour'
    },
    ar: {
        'nav-cars': 'السيارات',
        'nav-about': 'من نحن',
        'nav-contact': 'اتصل بنا',
        'hero-title-line1': 'اكتشف',
        'hero-title-line2': 'أفخم السيارات',
        'hero-title-line3': 'للتأجير',
        'hero-subtitle': 'استمتع بتجربة قيادة استثنائية مع أحدث موديلات السيارات الفاخرة',
        'stat-cars': 'سيارة متاحة',
        'stat-service': 'خدمة العملاء',
        'stat-satisfaction': 'رضا العملاء',
        'filter-title': 'ابحث عن سيارتك المثالية',
        'filter-brand': 'الماركة',
        'option-all-brands': 'جميع الماركات',
        'filter-fuel': 'نوع الوقود',
        'option-all-types': 'جميع الأنواع',
        'option-petrol': 'بنزين',
        'option-diesel': 'ديزل',
        'option-electric': 'كهربائي',
        'option-hybrid': 'هجين',
        'filter-transmission': 'ناقل الحركة',
        'option-all': 'الكل',
        'option-automatic': 'أوتوماتيك',
        'option-manual': 'يدوي',
        'filter-price': 'السعر (درهم/يوم)',
        'filter-year': 'سنة الصنع',
        'option-all-years': 'جميع السنوات',
        'btn-search': 'بحث',
        'btn-reset': 'إعادة',
        'cars-title': 'السيارات المتاحة',
        'loading-text': 'جاري تحميل السيارات...',
        'empty-title': 'لا توجد سيارات متاحة',
        'empty-text': 'جرب تغيير معايير البحث',
        'load-more': 'تحميل المزيد',
        'footer-desc': 'أفضل خدمة لتأجير السيارات الفاخرة في المغرب',
        'footer-quick-links': 'روابط سريعة',
        'footer-cars': 'السيارات',
        'footer-about': 'من نحن',
        'footer-contact': 'اتصل بنا',
        'footer-contact-us': 'تواصل معنا',
        'footer-follow': 'تابعنا',
        'fuel-type': 'نوع الوقود',
        'transmission': 'ناقل الحركة',
        'seats': 'المقاعد',
        'color': 'اللون',
        'price': 'السعر',
        'book-now': 'احجز الآن',
        'available': 'متاحة',
        'rented': 'مؤجرة',
        'day': '/يوم'
    }
};

// Language data with flag image URLs
const langData = {
    en: { flag: 'https://flagcdn.com/w40/gb.png', code: 'EN', name: 'English' },
    fr: { flag: 'https://flagcdn.com/w40/fr.png', code: 'FR', name: 'Français' },
    ar: { flag: 'https://flagcdn.com/w40/ma.png', code: 'AR', name: 'العربية' }
};

// Current language
let currentLang = 'en';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Set default language
    setLanguage('en');

    // Load cars from API or use demo data
    await loadCars();

    // Setup event listeners
    setupEventListeners();

    // Initialize price range display
    updatePriceDisplay();

    // Setup custom select dropdowns
    setupCustomSelects();
}

// Custom Select Logic
function setupCustomSelects() {
    const selects = document.querySelectorAll('.cyber-select');

    selects?.forEach(select => {
        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        // Custom select container
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
        wrapper.appendChild(customSelect);

        // Trigger
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        // Set initial text
        const selectedOption = select.options[select.selectedIndex];
        trigger.textContent = selectedOption ? selectedOption.textContent : select.options[0].textContent;
        customSelect.appendChild(trigger);

        // Options container
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'custom-options';
        customSelect.appendChild(optionsDiv);

        // Fill options
        Array.from(select.options).forEach(option => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;

            if (option.selected) {
                customOption.classList.add('selected');
            }

            // Handle click
            customOption.addEventListener('click', (e) => {
                e.stopPropagation();

                // Update implementation logic
                select.value = option.value;
                trigger.textContent = option.textContent;

                // Update visuals
                customSelect.querySelectorAll('.custom-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                customOption.classList.add('selected');

                // Close dropdown
                customSelect.classList.remove('open');
                trigger.classList.remove('active');

                // Trigger change event for listeners (if any) or call applyFilters directly
                select.dispatchEvent(new Event('change'));

                // If it's one of the filter selects, apply filters immediately or wait for search btn?
                // The current app logic waits for Search btn, so updating value is enough.
            });

            optionsDiv.appendChild(customOption);
        });

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other dropdowns
            document.querySelectorAll('.custom-select').forEach(el => {
                if (el !== customSelect) el.classList.remove('open');
            });

            customSelect.classList.toggle('open');
            trigger.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.custom-select').forEach(el => {
                el.classList.remove('open');
            });
        }
    });

    // Observe changes to language to update text in custom selects
    const observer = new MutationObserver(() => {
        selects.forEach(select => {
            const wrapper = select.closest('.custom-select-wrapper');
            const customSelect = wrapper.querySelector('.custom-select');
            if (customSelect) {
                // Rebuild options if language changed text content in native select
                const optionsDiv = customSelect.querySelector('.custom-options');
                const trigger = customSelect.querySelector('.custom-select-trigger');

                // Simply update text of currently selected trigger
                const selectedOption = select.options[select.selectedIndex];
                if (trigger && selectedOption) trigger.textContent = selectedOption.textContent;

                // Update all options text
                const customOptions = optionsDiv.querySelectorAll('.custom-option');
                Array.from(select.options).forEach((opt, idx) => {
                    if (customOptions[idx]) customOptions[idx].textContent = opt.textContent;
                });
            }
        });
    });

    selects.forEach(select => {
        observer.observe(select, { attributes: true, childList: true, subtree: true, characterData: true });
        // Also observe the options inside since translation logic updates textContent
        Array.from(select.options).forEach(opt => {
            observer.observe(opt, { characterData: true, subtree: true });
        });
    });
}
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const elements = document.querySelectorAll('[data-lang-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update language switcher display
    updateLangSwitcherDisplay(lang);

    // Re-render cars with new language
    if (filteredCars.length > 0) {
        renderCars();
    }
}

// Update language switcher display
function updateLangSwitcherDisplay(lang) {
    const flagEl = langCurrentBtn?.querySelector('.lang-flag');
    const codeEl = langCurrentBtn?.querySelector('.lang-code');

    if (flagEl && codeEl && langData[lang]) {
        // Update flag image src
        flagEl.src = langData[lang].flag;
        flagEl.alt = langData[lang].code;
        codeEl.textContent = langData[lang].code;
    }

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });
}

// Event Listeners
function setupEventListeners() {
    // Filter events
    searchBtn?.addEventListener('click', () => {
        applyFilters();
        // Scroll to cars-header section
        const carsHeader = document.querySelector('.cars-header');
        if (carsHeader) {
            carsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    resetBtn?.addEventListener('click', resetFilters);
    filterPrice?.addEventListener('input', updatePriceDisplay);

    // Modal events
    modalClose?.addEventListener('click', closeModal);
    carModal?.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            langSwitcher?.classList.remove('active');
        }
    });

    // Load more
    loadMoreBtn?.addEventListener('click', loadMoreCars);

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            carsGrid.className = view === 'list' ? 'cars-list' : 'cars-grid';
        });
    });

    // Language switcher toggle
    langCurrentBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher?.classList.toggle('active');
    });

    // Language options
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = opt.dataset.lang;
            setLanguage(lang);
            // Verify closure variable or query fresh to be safe
            document.getElementById('langSwitcher')?.classList.remove('active');
        });
    });

    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!langSwitcher?.contains(e.target)) {
            langSwitcher?.classList.remove('active');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks?.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Load Cars
async function loadCars() {
    showLoading(true);

    try {
        // Try to fetch from API
        const response = await fetch(`${API_BASE_URL}/cars`);
        if (response.ok) {
            cars = await response.json();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.log('Using demo data:', error.message);
        // Use demo data if API is not available
        cars = getDemoData();
    }

    filteredCars = [...cars];
    renderCars();
    updateCarCount();
    showLoading(false);
}

// Render Cars
function renderCars() {
    const startIndex = 0;
    const endIndex = currentPage * carsPerPage;
    const carsToShow = filteredCars.slice(startIndex, endIndex);

    if (carsToShow.length === 0) {
        carsGrid.innerHTML = '';
        emptyState?.classList.remove('hidden');
        loadMoreBtn?.classList.add('hidden');
        return;
    }

    emptyState?.classList.add('hidden');

    carsGrid.innerHTML = carsToShow.map(car => createCarCard(car)).join('');

    // Add click events to cards
    document.querySelectorAll('.car-card').forEach(card => {
        card.addEventListener('click', () => {
            const carId = card.dataset.id;
            const car = cars.find(c => c.id == carId);
            if (car) openCarModal(car);
        });
    });

    // Show/hide load more button
    if (endIndex >= filteredCars.length) {
        loadMoreBtn?.classList.add('hidden');
    } else {
        loadMoreBtn?.classList.remove('hidden');
    }
}

// Create Car Card HTML
function createCarCard(car) {
    const fuelLabels = {
        en: { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' },
        fr: { petrol: 'Essence', diesel: 'Diesel', electric: 'Électrique', hybrid: 'Hybride' },
        ar: { petrol: 'بنزين', diesel: 'ديزل', electric: 'كهربائي', hybrid: 'هجين' }
    };

    const transmissionLabels = {
        en: { automatic: 'Automatic', manual: 'Manual' },
        fr: { automatic: 'Automatique', manual: 'Manuelle' },
        ar: { automatic: 'أوتوماتيك', manual: 'يدوي' }
    };

    const statusKey = car.status === 'available' ? 'available' : 'rented';
    const statusLabel = translations[currentLang][statusKey];
    const statusBadge = car.status === 'available'
        ? `<span class="car-badge">${statusLabel}</span>`
        : `<span class="car-badge rented">${statusLabel}</span>`;

    // SVG Icons
    const fuelIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>`;
    const gearIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;
    const seatIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"/></svg>`;
    const eyeIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;

    return `
        <article class="car-card" data-id="${car.id}">
            <div class="car-image-container">
                <div class="car-gallery-slider">
                    <!-- Main Image -->
                    <img src="${car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'}" 
                         alt="${car.brand} ${car.model}" 
                         class="car-gallery-image"
                         loading="lazy">
                    <!-- Placeholder Images for Testing Gallery -->
                    <img src="https://images.unsplash.com/photo-1503376763036-066120622c74?w=400" class="car-gallery-image" loading="lazy" alt="Car view 2">
                    <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400" class="car-gallery-image" loading="lazy" alt="Car view 3">
                    <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400" class="car-gallery-image" loading="lazy" alt="Car view 4">
                    <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=400" class="car-gallery-image" loading="lazy" alt="Car view 5">
                </div>
            </div>
            <div class="car-content">
                <div class="car-header">
                    <div style="width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span class="car-brand">${car.brand}</span>
                            ${statusBadge}
                        </div>
                        <h3 class="car-model">${car.model}</h3>
                    </div>
                </div>
                <div class="car-specs">
                    <span class="spec-item">
                        ${fuelIcon}
                        ${fuelLabels[currentLang][car.fuel] || car.fuel}
                    </span>
                    <span class="spec-item">
                        ${gearIcon}
                        ${transmissionLabels[currentLang][car.transmission] || car.transmission}
                    </span>
                    <span class="spec-item">
                        ${seatIcon}
                        ${car.seats || 5}
                    </span>
                    <span class="spec-item car-year">
                        ${car.year}
                    </span>
                </div>
                <div class="car-footer">
                    <span class="car-price">${car.price} <span>DH${translations[currentLang]['day']}</span></span>
                    <div class="card-actions">
                        <a href="tel:+212600000000" class="btn-outline btn-call" onclick="event.stopPropagation();">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                            <span>${currentLang === 'ar' ? 'اتصل' : currentLang === 'fr' ? 'Appeler' : 'Call'}</span>
                        </a>
                        <a href="https://wa.me/212600000000?text=${currentLang === 'en' ? 'Hi, I want to book a ' : currentLang === 'fr' ? 'Bonjour, je veux réserver une ' : 'مرحبا، أريد حجز سيارة '} ${car.brand} ${car.model}" class="btn-outline btn-whatsapp" target="_blank" onclick="event.stopPropagation();">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// Open Car Modal
function openCarModal(car) {
    const fuelLabels = {
        en: { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' },
        fr: { petrol: 'Essence', diesel: 'Diesel', electric: 'Électrique', hybrid: 'Hybride' },
        ar: { petrol: 'بنزين', diesel: 'ديزل', electric: 'كهربائي', hybrid: 'هجين' }
    };

    const transmissionLabels = {
        en: { automatic: 'Automatic', manual: 'Manual' },
        fr: { automatic: 'Automatique', manual: 'Manuelle' },
        ar: { automatic: 'أوتوماتيك', manual: 'يدوي' }
    };

    modalBody.innerHTML = `
        <div class="modal-car-gallery">
            <img src="${car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}" 
                 alt="${car.brand} ${car.model}"
                 class="modal-car-image">
        </div>
        <div class="modal-car-info">
            <span class="car-brand">${car.brand}</span>
            <h2 class="modal-car-title">${car.model} <span>${car.year}</span></h2>
            
            <p class="modal-car-description">${car.description[currentLang] || car.description}</p>
            
            <div class="modal-car-specs">
                <div class="modal-spec">
                    <span class="material-icons-round">local_gas_station</span>
                    <div>
                        <span>${translations[currentLang]['fuel-type']}</span>
                        <strong>${fuelLabels[currentLang][car.fuel] || car.fuel}</strong>
                    </div>
                </div>
                <div class="modal-spec">
                    <span class="material-icons-round">settings</span>
                    <div>
                        <span>${translations[currentLang]['transmission']}</span>
                        <strong>${transmissionLabels[currentLang][car.transmission] || car.transmission}</strong>
                    </div>
                </div>
                <div class="modal-spec">
                    <span class="material-icons-round">event_seat</span>
                    <div>
                        <span>${translations[currentLang]['seats']}</span>
                        <strong>${car.seats || 5}</strong>
                    </div>
                </div>
                <div class="modal-spec">
                    <span class="material-icons-round">palette</span>
                    <div>
                        <span>${translations[currentLang]['color']}</span>
                        <strong>${car.color[currentLang] || car.color}</strong>
                    </div>
                </div>
            </div>
            
            <div class="modal-car-footer">
                <div class="modal-price">
                    <span>${translations[currentLang]['price']}</span>
                    <strong>${car.price} DH</strong>
                    <span>${translations[currentLang]['day']}</span>
                </div>
                <div class="modal-actions">
                    <a href="tel:+212600000000" class="btn-icon btn-icon-phone" title="Call Us">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                    </a>
                    <a href="https://wa.me/212600000000?text=${currentLang === 'en' ? 'Hi, I want to book a ' : 'مرحبا، أريد حجز سيارة '} ${car.brand} ${car.model}" 
                       class="btn-icon btn-icon-whatsapp" 
                       target="_blank"
                       title="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `;

    carModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    carModal?.classList.remove('active');
    document.body.style.overflow = '';
}

// Apply Filters
function applyFilters() {
    const brand = filterBrand?.value.toLowerCase() || '';
    const fuel = filterFuel?.value || '';
    const transmission = filterTransmission?.value || '';
    const maxPrice = parseInt(filterPrice?.value) || 5000;
    const year = filterYear?.value || '';

    filteredCars = cars.filter(car => {
        if (brand && car.brand.toLowerCase() !== brand) return false;
        if (fuel && car.fuel !== fuel) return false;
        if (transmission && car.transmission !== transmission) return false;
        if (car.price > maxPrice) return false;
        if (year && car.year != year) return false;
        return true;
    });

    currentPage = 1;
    renderCars();
}

// Reset Filters
function resetFilters() {
    if (filterBrand) filterBrand.value = '';
    if (filterFuel) filterFuel.value = '';
    if (filterTransmission) filterTransmission.value = '';
    if (filterPrice) filterPrice.value = 5000;
    if (filterYear) filterYear.value = '';

    updatePriceDisplay();
    filteredCars = [...cars];
    currentPage = 1;
    renderCars();
}

// Update Price Display
function updatePriceDisplay() {
    if (priceValue && filterPrice) {
        priceValue.textContent = `${filterPrice.value} DH`;
    }
}

// Load More Cars
function loadMoreCars() {
    currentPage++;
    renderCars();
}

// Update Car Count
function updateCarCount() {
    const totalCarsEl = document.getElementById('totalCars');
    if (totalCarsEl) {
        totalCarsEl.textContent = `${cars.length}+`;
    }
}

// Show/Hide Loading
function showLoading(show) {
    if (loadingState) {
        loadingState.classList.toggle('hidden', !show);
    }
    if (carsGrid) {
        carsGrid.classList.toggle('hidden', show);
    }
}

// Demo Data
function getDemoData() {
    return [
        {
            id: 1,
            brand: 'Mercedes-Benz',
            model: 'E-Class',
            year: 2024,
            price: 800,
            fuel: 'petrol',
            transmission: 'automatic',
            seats: 5,
            color: { en: 'Black', ar: 'أسود' },
            status: 'available',
            image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
            description: { en: 'Luxurious Mercedes E-Class with the latest specifications', ar: 'مرسيدس E-Class الفاخرة بأحدث المواصفات' }
        },
        {
            id: 2,
            brand: 'BMW',
            model: 'X5',
            year: 2023,
            price: 900,
            fuel: 'diesel',
            transmission: 'automatic',
            seats: 7,
            color: { en: 'White', ar: 'أبيض' },
            status: 'available',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
            description: { en: 'Sporty BMW X5 with versatile functionality', ar: 'BMW X5 الرياضية متعددة الاستخدامات' }
        },
        {
            id: 3,
            brand: 'Audi',
            model: 'A6',
            year: 2024,
            price: 750,
            fuel: 'petrol',
            transmission: 'automatic',
            seats: 5,
            color: { en: 'Grey', ar: 'رمادي' },
            status: 'rented',
            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
            description: { en: 'Elegant and modern Audi A6', ar: 'أودي A6 الأنيقة والعصرية' }
        },
        {
            id: 4,
            brand: 'Toyota',
            model: 'Camry',
            year: 2023,
            price: 400,
            fuel: 'hybrid',
            transmission: 'automatic',
            seats: 5,
            color: { en: 'Silver', ar: 'فضي' },
            status: 'available',
            image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
            description: { en: 'Economical Toyota Camry hybrid', ar: 'تويوتا كامري الهجينة الاقتصادية' }
        },
        {
            id: 5,
            brand: 'Honda',
            model: 'Accord',
            year: 2023,
            price: 350,
            fuel: 'petrol',
            transmission: 'automatic',
            seats: 5,
            color: { en: 'Blue', ar: 'أزرق' },
            status: 'available',
            image: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400',
            description: { en: 'Comfortable and reliable Honda Accord', ar: 'هوندا أكورد المريحة والموثوقة' }
        },
        {
            id: 6,
            brand: 'Ford',
            model: 'Mustang',
            year: 2024,
            price: 1200,
            fuel: 'petrol',
            transmission: 'manual',
            seats: 4,
            color: { en: 'Red', ar: 'أحمر' },
            status: 'available',
            image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718e?w=400',
            description: { en: 'Legendary Ford Mustang sports car', ar: 'فورد موستنج الرياضية الأسطورية' }
        }
    ];
}
