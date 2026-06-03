# 🐾 PawShelter – Hayvan Barınağı Yönetim Platformu

![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-7C3AED?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)
![Auth](https://img.shields.io/badge/Auth-JWT-F59E0B?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> **Yazılım Mimarisi Dersi Kapsamında Geliştirilen Proje**
> Clean Architecture prensipleri, ADR dokümantasyonu ve profesyonel kod standartları ile tasarlanmış hayvan barınağı yönetim sistemi.

---

## 📋 İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Mimari Yapı](#mimari-yapı)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Proje Yapısı](#proje-yapısı)
- [Kurulum](#kurulum)
- [API Endpoint'leri](#api-endpointleri)
- [ADR Dokümantasyonu](#adr-dokümantasyonu)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

---

## 🎯 Proje Hakkında

PawShelter, hayvan barınaklarının günlük operasyonlarını dijitalleştiren, modern bir web tabanlı yönetim platformudur. Sistem şu temel işlevleri sağlar:

- **Hayvan Yönetimi**: Kayıt, güncelleme, silme ve filtreleme
- **Sahiplenme Süreci**: Başvuru alma, değerlendirme ve onay/red akışı
- **Sağlık Takibi**: Aşı takvimi ve veteriner ziyaret kayıtları
- **Admin Paneli**: Gerçek zamanlı istatistikler ve raporlar
- **Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama ve RBAC

---

## 🏛️ Mimari Yapı

Proje **Clean Architecture** (Temiz Mimari) prensiplerine göre tasarlanmıştır:

```
┌─────────────────────────────────────────────────────┐
│              Presentation Layer                      │
│         (FastAPI Controllers, DTOs)                  │
├─────────────────────────────────────────────────────┤
│              Application Layer                       │
│      (Use Cases, Services, Business Logic)           │
├─────────────────────────────────────────────────────┤
│                Domain Layer                          │
│        (Entities, Value Objects, Rules)              │
├─────────────────────────────────────────────────────┤
│            Infrastructure Layer                      │
│    (PostgreSQL, JWT, File Storage, Email)            │
└─────────────────────────────────────────────────────┘
```

**Bağımlılık Kuralı**: Kaynak kodu bağımlılıkları yalnızca içe doğru işaret eder.
Domain katmanı hiçbir dış bağımlılık içermez.

---

## 🛠️ Teknoloji Yığını

| Katman       | Teknoloji              | Versiyon |
|--------------|------------------------|----------|
| Backend      | FastAPI (Python)       | 0.110+   |
| ORM          | SQLAlchemy             | 2.0+     |
| Veritabanı   | PostgreSQL             | 15+      |
| Migration    | Alembic                | 1.13+    |
| Auth         | python-jose (JWT)      | 3.3+     |
| Şifreleme    | passlib (bcrypt)       | 1.7+     |
| Frontend     | Tailwind CSS           | CDN      |
| İkonlar      | Font Awesome           | 6.4      |
| Test         | Pytest + pytest-asyncio| Latest   |
| Container    | Docker + Docker Compose| Latest   |
| CI/CD        | GitHub Actions         | -        |

---

## 📁 Proje Yapısı

```
hayvan-barinagi/
├── index.html                    # Ana sayfa / Landing page
├── dashboard.html                # Admin dashboard
├── animals.html                  # Hayvan listesi
├── adoptions.html                # Sahiplenme talepleri
├── login.html                    # Giriş sayfası
├── register.html                 # Kayıt sayfası
├── assets/
│   ├── css/
│   │   └── style.css             # Custom styles
│   └── js/
│       ├── app.js                # Main app logic
│       ├── animals.js            # Animals page logic
│       ├── adoptions.js          # Adoptions logic
│       └── dashboard.js          # Dashboard charts/stats
├── docs/
│   ├── adr-001-architecture.html # ADR: Mimari seçimi
│   ├── adr-002-database.html     # ADR: Veritabanı seçimi
│   ├── adr-003-auth.html         # ADR: Kimlik doğrulama
│   ├── api-docs.html             # API dokümantasyonu
│   ├── CODE_REVIEW_CHECKLIST.md  # Code review checklist
│   └── ISSUES_TEMPLATE.md        # Issue templates
├── README.md
└── .gitignore
```

---

## 🚀 Kurulum

### Frontend (Statik)

```bash
# Projeyi klonlayın
git clone https://github.com/username/pawshelter.git
cd pawshelter/hayvan-barinagi

# Herhangi bir HTTP sunucusu ile açın
# Python ile:
python -m http.server 8080

# Node.js ile:
npx serve .

# Tarayıcıda açın:
# http://localhost:8080
```

### Backend (FastAPI)

```bash
# Python sanal ortamı oluşturun
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

# Veritabanı migration
alembic upgrade head

# Sunucuyu başlatın
uvicorn app.main:app --reload --port 8000
```

### Docker ile Çalıştırma

```bash
docker-compose up -d
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 📡 API Endpoint'leri

| Method | Endpoint                        | Açıklama                    | Auth     |
|--------|---------------------------------|-----------------------------|----------|
| POST   | /api/v1/auth/register           | Kullanıcı kaydı             | Public   |
| POST   | /api/v1/auth/login              | Kullanıcı girişi            | Public   |
| GET    | /api/v1/animals                 | Hayvan listesi              | Public   |
| POST   | /api/v1/animals                 | Yeni hayvan ekle            | Admin    |
| PUT    | /api/v1/animals/{id}            | Hayvan güncelle             | Admin    |
| DELETE | /api/v1/animals/{id}            | Hayvan sil                  | Admin    |
| POST   | /api/v1/adoptions/request       | Sahiplenme talebi oluştur   | User     |
| GET    | /api/v1/adoptions/requests      | Talepleri listele           | Admin    |
| PUT    | /api/v1/adoptions/requests/{id} | Talebi onayla/reddet        | Admin    |
| GET    | /api/v1/admin/stats             | Dashboard istatistikleri    | Admin    |

Detaylı API dokümantasyonu: [docs/api-docs.html](docs/api-docs.html)

---

## 📚 ADR Dokümantasyonu

| ADR     | Başlık                  | Durum        |
|---------|-------------------------|--------------|
| ADR-001 | Mimari Seçimi           | Kabul Edildi |
| ADR-002 | Veritabanı Seçimi       | Kabul Edildi |
| ADR-003 | Kimlik Doğrulama        | Kabul Edildi |

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun: `git checkout -b feature/yeni-ozellik`
3. Değişikliklerinizi commit edin: `git commit -m 'feat: yeni özellik eklendi'`
4. Branch'i push edin: `git push origin feature/yeni-ozellik`
5. Pull Request açın

Lütfen [CODE_REVIEW_CHECKLIST.md](docs/CODE_REVIEW_CHECKLIST.md) dosyasını inceleyin.

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

*© 2024 PawShelter – Yazılım Mimarisi Dersi Projesi*
