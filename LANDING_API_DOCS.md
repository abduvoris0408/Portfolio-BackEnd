# 🌐 Landing Page — Frontend API Documentation

**Base URL:** `https://portfolio-backend-rh0y.onrender.com/api/v1`

> Barcha GET so'rovlar **autentifikatsiyasiz** ishlaydi (token kerak emas).
> Faqat Contact va Consultation POST so'rovlari ham **autentifikatsiyasiz**.

---

## 📋 Mundarija

1. [About (Hero, Bio, Stats)](#1-about)
2. [Services (Xizmatlar)](#2-services)
3. [Service Details (Xizmat tafsilotlari)](#3-service-details)
4. [Projects (Loyihalar)](#4-projects)
5. [Skills (Ko'nikmalar)](#5-skills)
6. [Categories (Kategoriyalar)](#6-categories)
7. [Experiences (Tajriba)](#7-experiences)
8. [Education (Ta'lim)](#8-education)
9. [Achievements (Yutuqlar/Sertifikatlar)](#9-achievements)
10. [Partners (Hamkorlar)](#10-partners)
11. [Testimonials (Mijozlar fikri)](#11-testimonials)
12. [FAQs (Savollar)](#12-faqs)
13. [News (Yangiliklar)](#13-news)
14. [Blog Posts](#14-blog-posts)
15. [Contact (Aloqa formasi)](#15-contact)
16. [Consultation (Maslahat so'rovi)](#16-consultation)

---

## Umumiy Response Formati

### Muvaffaqiyatli (single object):
```json
{
  "success": true,
  "data": { ... }
}
```

### Muvaffaqiyatli (ro'yxat + pagination):
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 50,
    "pages": 2
  },
  "data": [ ... ]
}
```

### Xatolik:
```json
{
  "success": false,
  "error": "Xatolik xabari"
}
```

### Query Parametrlari (barcha ro'yxat endpoint'larida ishlaydi):
| Parametr | Tavsif | Misol |
|---|---|---|
| `page` | Sahifa raqami | `?page=2` |
| `limit` | Har sahifada nechta | `?limit=10` |
| `sort` | Tartiblash | `?sort=-createdAt` yoki `?sort=order` |
| `search` | Qidirish | `?search=advokat` |
| `fields` | Faqat kerakli fieldlar | `?fields=title,image` |

---

## 1. About

Shaxsiy ma'lumotlar, hero section, bio, statistikalar — barchasi bitta object'da.

### `GET /about`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Abduvoris Abdullayev",
    "title": "Advokat",
    "subtitle": "Professional huquqiy yordam",
    "typingTexts": ["Advokat", "Huquqshunos", "Maslahatchi"],
    "avatar": { "url": "https://res.cloudinary.com/.../avatar.jpg", "publicId": "avatars/abc123" },
    "coverImage": { "url": "https://res.cloudinary.com/.../cover.jpg", "publicId": "covers/xyz789" },
    "resume": { "url": "https://res.cloudinary.com/.../resume.pdf", "publicId": "documents/res123" },
    "bio": "Uzun bio matni...",
    "shortBio": "Qisqa bio",
    "phone": "+998901234567",
    "email": "info@advokat.uz",
    "address": "Toshkent shahar, ...",
    "birthday": "1990-05-15",
    "nationality": "O'zbekiston",
    "freelanceStatus": "available",
    "location": { "city": "Toshkent", "country": "O'zbekiston", "mapUrl": "https://maps.google.com/..." },
    "languages": [
      { "name": "O'zbek", "level": "Native" },
      { "name": "Rus", "level": "Professional" }
    ],
    "socialLinks": {
      "telegram": "https://t.me/username",
      "instagram": "https://instagram.com/username",
      "facebook": "https://facebook.com/username"
    },
    "stats": {
      "projectsCompleted": 150,
      "happyClients": 200,
      "yearsExperience": 10,
      "awardsWon": 15,
      "coffeesDrunk": 5000,
      "linesOfCode": 100000
    },
    "interests": ["Huquq", "Kitob o'qish", "Sayohat"],
    "whatIDo": [
      { "title": "Fuqarolik ishlari", "description": "...", "icon": "⚖️" }
    ],
    "seo": {
      "metaTitle": "Advokat — Abduvoris Abdullayev",
      "metaDescription": "Professional huquqiy xizmatlar",
      "metaKeywords": ["advokat", "huquqiy yordam"],
      "ogImage": ""
    },
    "isActive": true,
    "age": 35,
    "createdAt": "2026-02-16T07:40:06.000Z",
    "updatedAt": "2026-02-16T07:40:06.000Z"
  }
}
```

---

## 2. Services

### `GET /services`
Barcha xizmatlar ro'yxati, kategoriya bilan.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "pagination": { "page": 1, "limit": 25, "total": 5, "pages": 1 },
  "data": [
    {
      "id": "uuid",
      "title": "Fuqarolik ishlari",
      "slug": "fuqarolik-ishlari",
      "description": "Fuqarolik ishlari bo'yicha yordam...",
      "icon": "⚖️",
      "image": { "url": "https://...", "publicId": "services/abc" },
      "categoryId": "uuid",
      "price": "500 000 so'm dan",
      "order": 1,
      "isActive": true,
      "createdAt": "2026-02-16T...",
      "updatedAt": "2026-02-16T...",
      "category": {
        "id": "uuid",
        "name": "Huquqiy xizmatlar",
        "slug": "huquqiy-xizmatlar",
        "color": "#3B82F6"
      }
    }
  ]
}
```

### `GET /services/:id`
Bitta xizmat + uning tafsilotlari.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fuqarolik ishlari",
    "slug": "fuqarolik-ishlari",
    "description": "...",
    "icon": "⚖️",
    "image": { "url": "https://...", "publicId": "..." },
    "categoryId": "uuid",
    "price": "500 000 so'm dan",
    "order": 1,
    "isActive": true,
    "category": { "id": "uuid", "name": "Huquqiy xizmatlar", "slug": "...", "color": "#3B82F6" },
    "details": [
      {
        "id": "uuid",
        "serviceId": "uuid",
        "title": "Ariza tuzish",
        "description": "Sudga ariza tayyorlash",
        "icon": "📝",
        "order": 1
      }
    ]
  }
}
```

---

## 3. Service Details

### `GET /service-details`
Barcha xizmat tafsilotlari.

### `GET /service-details?serviceId=<uuid>`
Bitta xizmatning tafsilotlari.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "pagination": { "page": 1, "limit": 25, "total": 3, "pages": 1 },
  "data": [
    {
      "id": "uuid",
      "serviceId": "uuid",
      "title": "Ariza tuzish",
      "description": "...",
      "icon": "📝",
      "order": 1,
      "createdAt": "...",
      "updatedAt": "...",
      "service": { "id": "uuid", "title": "Fuqarolik ishlari", "slug": "fuqarolik-ishlari" }
    }
  ]
}
```

---

## 4. Projects

### `GET /projects`

**Response:**
```json
{
  "success": true,
  "count": 8,
  "pagination": { "page": 1, "limit": 25, "total": 8, "pages": 1 },
  "data": [
    {
      "id": "uuid",
      "title": "Fuqarolik ishi #127",
      "slug": "fuqarolik-ishi-127",
      "shortDescription": "Qisqa tavsif...",
      "description": "To'liq tavsif...",
      "image": { "url": "https://...", "publicId": "..." },
      "gallery": [
        { "url": "https://...", "publicId": "..." }
      ],
      "clientUrl": "https://mijoz-sayti.uz",
      "categoryId": "uuid",
      "status": "published",
      "isFeatured": true,
      "views": 120,
      "order": 1,
      "completedAt": "2025-12-01",
      "createdAt": "...",
      "updatedAt": "...",
      "category": { "id": "uuid", "name": "Fuqarolik", "slug": "fuqarolik", "color": "#3B82F6" }
    }
  ]
}
```

### `GET /projects/:id`
Bitta loyihani olish (javob yuqoridagiga o'xshash, faqat `data` — bitta object).

---

## 5. Skills

### `GET /skills`

**Response:**
```json
{
  "success": true,
  "count": 6,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "name": "Jinoyat huquqi",
      "level": "expert",
      "percentage": 95,
      "icon": "⚖️",
      "image": { "url": "https://...", "publicId": "..." },
      "categoryId": "uuid",
      "order": 1,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "...",
      "category": { "id": "uuid", "name": "Huquq", "slug": "huquq", "color": "#..." }
    }
  ]
}
```

> `level` qiymatlari: `beginner`, `intermediate`, `advanced`, `expert`
> `percentage`: 0 dan 100 gacha

---

## 6. Categories

### `GET /categories`

**Query:** `?type=service` — faqat xizmat kategoriyalari

**Response:**
```json
{
  "success": true,
  "count": 5,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "name": "Huquqiy xizmatlar",
      "slug": "huquqiy-xizmatlar",
      "type": "service",
      "description": "Huquqiy xizmatlar kategoriyasi",
      "icon": "⚖️",
      "color": "#3B82F6",
      "image": { "url": "https://...", "publicId": "..." },
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

> `type` qiymatlari: `project`, `blog`, `service`, `skill`, `news`

---

## 7. Experiences

### `GET /experiences`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "company": "Abdullayev va Hamkorlar",
      "position": "Bosh advokat",
      "description": "Fuqarolik va jinoyat ishlari...",
      "specializations": ["Fuqarolik huquqi", "Jinoyat huquqi"],
      "location": "Toshkent",
      "companyUrl": "https://advokat.uz",
      "companyLogo": { "url": "https://...", "publicId": "..." },
      "startDate": "2020-01-15",
      "endDate": null,
      "current": true,
      "order": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

> `current: true` bo'lsa — hozir shu yerda ishlaydi, `endDate` bo'lmaydi.

---

## 8. Education

### `GET /education`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "school": "TDYU",
      "degree": "Magistr",
      "fieldOfStudy": "Huquqshunoslik",
      "description": "Huquq fakulteti...",
      "gpa": 4.5,
      "achievements": ["Imtiyozli diplom", "Stipendiya"],
      "schoolUrl": "https://tdyu.uz",
      "schoolLogo": { "url": "https://...", "publicId": "..." },
      "startDate": "2015-09-01",
      "endDate": "2019-06-30",
      "current": false,
      "order": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 9. Achievements

### `GET /achievements`

**Response:**
```json
{
  "success": true,
  "count": 4,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "title": "Litsenziyali advokat",
      "issuer": "O'zbekiston Advokatlar Palatasi",
      "date": "2023-05-10",
      "image": { "url": "https://...", "publicId": "..." },
      "description": "Rasmiy advokat litsenziyasi",
      "type": "license",
      "order": 1,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

> `type` qiymatlari: `license`, `certificate`, `award`, `membership`

---

## 10. Partners

### `GET /partners`

**Response:**
```json
{
  "success": true,
  "count": 6,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "name": "Huquqiy Klinika",
      "logo": { "url": "https://...", "publicId": "..." },
      "url": "https://huquqiy-klinika.uz",
      "description": "Hamkor tashkilot",
      "order": 1,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 11. Testimonials

### `GET /testimonials`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "clientName": "Alisher Karimov",
      "clientPosition": "Tadbirkor",
      "clientImage": { "url": "https://...", "publicId": "..." },
      "content": "Juda professional xizmat ko'rsatishdi...",
      "rating": 5,
      "caseType": "Fuqarolik ishi",
      "order": 1,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

> `rating`: 1 dan 5 gacha

---

## 12. FAQs

### `GET /faqs`

**Response:**
```json
{
  "success": true,
  "count": 8,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "question": "Advokat bilan maslahat qancha turadi?",
      "answer": "Birinchi maslahat bepul...",
      "categoryId": "uuid",
      "order": 1,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "...",
      "category": { "id": "uuid", "name": "Umumiy", "slug": "umumiy", "color": "#..." }
    }
  ]
}
```

---

## 13. News

### `GET /news`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "title": "Yangi qonun loyihasi qabul qilindi",
      "slug": "yangi-qonun-loyihasi-qabul-qilindi",
      "content": "To'liq maqola matni...",
      "excerpt": "Qisqa tavsif...",
      "image": { "url": "https://...", "publicId": "..." },
      "categoryId": "uuid",
      "source": "Kun.uz",
      "sourceUrl": "https://kun.uz/...",
      "status": "published",
      "isFeatured": true,
      "views": 250,
      "publishedAt": "2026-02-15T10:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "...",
      "category": { "id": "uuid", "name": "Qonunchilik", "slug": "qonunchilik", "color": "#..." },
      "tags": [{ "id": "uuid", "name": "qonun" }]
    }
  ]
}
```

### `GET /news/:id`
Bitta yangilik (single object).

---

## 14. Blog Posts

### `GET /blog-posts`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "pagination": { ... },
  "data": [
    {
      "id": "uuid",
      "title": "Fuqarolik ishlarida huquqlaringiz",
      "slug": "fuqarolik-ishlarida-huquqlaringiz",
      "content": "To'liq maqola matni...",
      "excerpt": "Qisqa tavsif...",
      "image": { "url": "https://...", "publicId": "..." },
      "categoryId": "uuid",
      "status": "published",
      "isFeatured": false,
      "views": 89,
      "readTime": 5,
      "allowComments": true,
      "metaTitle": "Fuqarolik ishlari | Blog",
      "metaDescription": "...",
      "publishedAt": "2026-02-14T...",
      "createdAt": "...",
      "updatedAt": "...",
      "category": { "id": "uuid", "name": "Huquq", "slug": "huquq", "color": "#..." },
      "tags": [{ "id": "uuid", "name": "fuqarolik" }]
    }
  ]
}
```

### `GET /blog-posts/:id`
Bitta blog post.

---

## 15. Contact

### `POST /contacts` ⭐ Auth kerak EMAS

Landing sahifadagi **aloqa formasi** uchun.

**Request Body:**
```json
{
  "name": "Alisher",
  "email": "alisher@example.com",
  "phone": "+998901234567",
  "subject": "Maslahat olish",
  "message": "Salom, fuqarolik ishi bo'yicha maslahat kerak edi..."
}
```

| Field | Turi | Majburiy | Tavsif |
|---|---|---|---|
| `name` | string | ✅ | Ism |
| `email` | string | ✅ | Email (format tekshiriladi) |
| `phone` | string | ❌ | Telefon raqam |
| `subject` | string | ✅ | Xabar mavzusi |
| `message` | string | ✅ | Xabar matni |

**Response (201):**
```json
{
  "success": true,
  "message": "Xabaringiz yuborildi!",
  "data": {
    "id": "uuid",
    "name": "Alisher",
    "email": "alisher@example.com",
    "phone": "+998901234567",
    "subject": "Maslahat olish",
    "message": "Salom, fuqarolik ishi bo'yicha maslahat kerak edi...",
    "isRead": false,
    "isReplied": false,
    "createdAt": "2026-02-16T..."
  }
}
```

---

## 16. Consultation

### `POST /consultations` ⭐ Auth kerak EMAS

Landing sahifadagi **maslahat so'rovi formasi** uchun.

**Request Body:**
```json
{
  "fullName": "Bobur Toshmatov",
  "phone": "+998901234567",
  "email": "bobur@example.com",
  "serviceId": "uuid",
  "preferredDate": "2026-03-01",
  "preferredTime": "14:00",
  "message": "Jinoyat ishi bo'yicha maslahat kerak"
}
```

| Field | Turi | Majburiy | Tavsif |
|---|---|---|---|
| `fullName` | string | ✅ | To'liq ism |
| `phone` | string | ✅ | Telefon raqam |
| `email` | string | ❌ | Email |
| `serviceId` | UUID | ❌ | Qaysi xizmat uchun (services'dan id) |
| `preferredDate` | date | ❌ | Istalgan sana (YYYY-MM-DD) |
| `preferredTime` | string | ❌ | Istalgan vaqt ("14:00") |
| `message` | string | ❌ | Qo'shimcha xabar |

**Response (201):**
```json
{
  "success": true,
  "message": "Maslahat so'rovingiz yuborildi!",
  "data": {
    "id": "uuid",
    "fullName": "Bobur Toshmatov",
    "phone": "+998901234567",
    "email": "bobur@example.com",
    "serviceId": "uuid",
    "preferredDate": "2026-03-01",
    "preferredTime": "14:00",
    "message": "Jinoyat ishi bo'yicha maslahat kerak",
    "status": "pending",
    "createdAt": "2026-02-16T..."
  }
}
```

---

## 🖼️ Rasm Formati

Barcha rasm field'lari (avatar, image, logo, gallery) shu formatda:

```json
{
  "url": "https://res.cloudinary.com/dknud04zr/image/upload/v123/folder/filename.jpg",
  "publicId": "folder/filename"
}
```

> `url` — to'g'ridan-to'g'ri `<img src>` da ishlatish mumkin.
> `null` bo'lishi mumkin — rasm yuklanmagan bo'lsa.

---

## ⚡ Frontend Axios Sozlash

```javascript
import axios from 'axios'

const API = axios.create({
  baseURL: 'https://portfolio-backend-rh0y.onrender.com/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

// Misol: barcha ma'lumotlarni olish
const [about, services, projects, skills, experiences, education, achievements, partners, testimonials, faqs, news] = await Promise.all([
  API.get('/about'),
  API.get('/services?sort=order'),
  API.get('/projects?status=published&sort=-createdAt'),
  API.get('/skills?sort=order'),
  API.get('/experiences?sort=order'),
  API.get('/education?sort=order'),
  API.get('/achievements?sort=order'),
  API.get('/partners?sort=order'),
  API.get('/testimonials?sort=order'),
  API.get('/faqs?sort=order'),
  API.get('/news?status=published&sort=-publishedAt&limit=6'),
])

// Aloqa formasi
await API.post('/contacts', { name, email, phone, subject, message })

// Konsultatsiya so'rovi
await API.post('/consultations', { fullName, phone, email, serviceId, preferredDate, preferredTime, message })
```
