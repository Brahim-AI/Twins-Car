# 🚗 Car Rental Pro

> A modern, sleek car rental platform built with Cloudflare Pages (Frontend) and Cloudflare Workers (Backend).

![Car Rental Pro](https://img.shields.io/badge/Status-In%20Development-brightgreen)
![Cloudflare](https://img.shields.io/badge/Powered%20by-Cloudflare-orange)

## 📁 Project Structure

```
car-rental-pro/
├── 📁 frontend/                # Cloudflare Pages
│   ├── 📄 index.html           # Main page (Car listings + Filters)
│   ├── 📄 admin.html           # Admin Management Panel
│   ├── 📁 css/
│   │   └── 🎨 style.css        # Modern/Cyber Design Styling
│   ├── 📁 js/
│   │   ├── 📜 main.js          # User-facing logic (Display & Filtering)
│   │   └── 📜 admin.js         # Admin logic (Upload/Add/Delete)
│   └── 📁 assets/              # Static logos and icons
│
├── 📁 backend/                 # Cloudflare Workers
│   ├── 📄 wrangler.toml        # D1 Database & R2 Storage bindings
│   ├── 📄 schema.sql           # Database schema (Cars & Admin tables)
│   └── 📁 src/
│       ├── 📜 index.js         # Main API (Routing)
│       ├── 📜 database.js      # D1 Database operations
│       └── 📜 storage.js       # R2 Storage operations (Image upload/delete)
│
├── 📄 .gitignore
└── 📄 README.md
```

## 🚀 Features

### Frontend
- ✅ Modern Cyber/Neon Design
- ✅ Responsive Layout (Mobile & Desktop)
- ✅ Advanced Car Filtering (Brand, Price, Year, Fuel Type)
- ✅ Image Gallery with Smooth Transitions
- ✅ Admin Dashboard for Car Management

### Backend
- ✅ RESTful API with Cloudflare Workers
- ✅ D1 Database for Car & Admin Data
- ✅ R2 Storage for Image Management
- ✅ Secure Admin Authentication

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 |
| Hosting | Cloudflare Pages |

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare Account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/car-rental-pro.git
cd car-rental-pro
```

### 2. Backend Setup
```bash
cd backend

# Login to Cloudflare
wrangler login

# Create D1 Database
wrangler d1 create car-rental-db

# Update wrangler.toml with database_id

# Run migrations
wrangler d1 execute car-rental-db --file=./schema.sql

# Create R2 Bucket
wrangler r2 bucket create car-images

# Deploy Worker
wrangler deploy
```

### 3. Frontend Setup
```bash
cd frontend

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=car-rental-pro
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cars` | Get all cars (with optional filters) |
| `GET` | `/api/cars/:id` | Get single car details |
| `POST` | `/api/cars` | Add new car (Admin) |
| `PUT` | `/api/cars/:id` | Update car (Admin) |
| `DELETE` | `/api/cars/:id` | Delete car (Admin) |
| `POST` | `/api/upload` | Upload car image to R2 |
| `DELETE` | `/api/images/:key` | Delete image from R2 |
| `POST` | `/api/admin/login` | Admin authentication |

## 🎨 Design Theme

The UI follows a **Cyber/Neon** aesthetic with:
- Dark backgrounds (`#0a0f1c`, `#1a1f2e`)
- Neon accent colors (Cyan `#00d4ff`, Purple `#9d4edd`, Pink `#ff006e`)
- Glassmorphism effects
- Smooth animations and transitions

## 📄 License

MIT License - Feel free to use and modify!

---

**Made with 💜 by CarRentalPro Team**
