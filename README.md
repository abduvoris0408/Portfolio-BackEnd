# Portfolio API Node.js

## Admin panel uchun backend

Professional Portfolio API - Node.js, Express, MongoDB bilan qurilgan.

## 🚀 Xususiyatlar

- ✅ **Authentication** - JWT token bilan register/login
- ✅ **Projects** - Loyihalar CRUD
- ✅ **Skills** - Ko'nikmalar boshqaruvi
- ✅ **Categories** - Kategoriyalar
- ✅ **Experiences** - Ish tajribasi
- ✅ **Education** - Ta'lim ma'lumotlari
- ✅ **Contact** - Aloqa xabarlari
- ✅ **Security** - Helmet, Rate Limiting, XSS himoya
- ✅ **Swagger Docs** - API dokumentatsiyasi

## 📦 O'rnatish

```bash
# Dependencylarni o'rnatish
npm install

# Development serverini ishga tushirish
npm run dev

# Production serverini ishga tushirish
npm start
```

## ⚙️ Environment Variables

`.env` fayli yarating va quyidagilarni qo'shing:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# API
API_VERSION=v2
API_PREFIX=/api

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Logging
LOG_LEVEL=info
```

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/v2/auth/login` | Tizimga kirish |
| GET | `/api/v2/auth/logout` | Chiqish |
| GET | `/api/v2/auth/me` | Joriy user |
| PUT | `/api/v2/auth/updatedetails` | Profilni yangilash |
| PUT | `/api/v2/auth/updatepassword` | Parolni yangilash |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/projects` | Barcha loyihalar |
| GET | `/api/v2/projects/:id` | Bitta loyiha |
| POST | `/api/v2/projects` | Yangi loyiha (auth) |
| PUT | `/api/v2/projects/:id` | Yangilash (auth) |
| DELETE | `/api/v2/projects/:id` | O'chirish (auth) |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/skills` | Barcha ko'nikmalar |
| POST | `/api/v2/skills` | Yangi ko'nikma (auth) |
| PUT | `/api/v2/skills/:id` | Yangilash (auth) |
| DELETE | `/api/v2/skills/:id` | O'chirish (auth) |

### Experiences
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/experiences` | Barcha tajribalar |
| POST | `/api/v2/experiences` | Yangi tajriba (auth) |
| PUT | `/api/v2/experiences/:id` | Yangilash (auth) |
| DELETE | `/api/v2/experiences/:id` | O'chirish (auth) |

### Education
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/education` | Barcha ta'lim |
| POST | `/api/v2/education` | Yangi ta'lim (auth) |
| PUT | `/api/v2/education/:id` | Yangilash (auth) |
| DELETE | `/api/v2/education/:id` | O'chirish (auth) |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/contact` | Xabar yuborish |
| GET | `/api/v2/contact` | Xabarlar (admin) |
| GET | `/api/v2/contact/stats` | Statistika (admin) |
| PUT | `/api/v2/contact/:id/read` | O'qilgan (admin) |
| DELETE | `/api/v2/contact/:id` | O'chirish (admin) |

## 📖 Swagger Dokumentatsiya

Server ishga tushgandan so'ng:
```
http://localhost:5000/api-docs
```

## 🛡️ Xavfsizlik

- **Helmet** - HTTP security headers
- **Rate Limiting** - So'rovlar cheklovi
- **Mongo Sanitize** - NoSQL injection himoya
- **CORS** - Cross-Origin Resource Sharing
- **JWT** - Token-based authentication

## 📁 Loyiha Strukturasi

```
├── app.js              # Asosiy server fayli
├── config/             # Konfiguratsiya
│   ├── db.config.js
│   ├── env.config.js
│   ├── cloudinary.config.js
│   └── swagger.config.js
├── controllers/        # Route handlerlari
├── middleware/         # Custom middlewarelar
├── models/             # Mongoose modellari
├── routes/             # API routelari
├── utils/              # Yordamchi funksiyalar
└── logs/               # Log fayllar
```

## 👤 Muallif

**Abduvoris**

## 📄 Litsenziya

MIT
