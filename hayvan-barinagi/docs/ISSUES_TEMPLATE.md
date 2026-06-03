# 📋 GitHub Issue Şablonları

Bu dosya, PawShelter projesi için örnek GitHub issue şablonlarını içermektedir.

---

## Issue #1: Kullanıcı Kayıt API'sinin Yazılması

**Başlık:** `[FEATURE] POST /auth/register endpoint'inin implementasyonu`

**Etiketler:** `feature`, `backend`, `auth`, `priority:high`

**Atanan:** Backend Geliştirici

**Milestone:** Sprint 1 – Temel Auth Altyapısı

---

### 📝 Açıklama

Kullanıcıların sisteme kayıt olabilmesi için `POST /api/v1/auth/register` endpoint'i geliştirilmelidir.
Bu endpoint, Clean Architecture'ın Application katmanında `UserService.register()` metodunu çağırmalıdır.

### ✅ Kabul Kriterleri (Acceptance Criteria)

- [ ] Geçerli email, şifre (min 8 karakter), ad soyad ve telefon ile kayıt yapılabilmeli
- [ ] Aynı email ile ikinci kayıt denemesinde `409 Conflict` hatası dönmeli
- [ ] Şifre bcrypt (cost factor 12) ile hash'lenmeli, plain text saklanmamalı
- [ ] Başarılı kayıt sonrası `access_token` ve `refresh_token` dönmeli
- [ ] Pydantic ile request body doğrulaması yapılmalı
- [ ] Unit test coverage %90 üzerinde olmalı

### 📋 Görevler (Tasks)

- [ ] `domain/entities/user.py` – User entity tanımla
- [ ] `repositories/interfaces/i_user_repository.py` – Interface yaz
- [ ] `repositories/implementations/user_repository.py` – PostgreSQL implementasyonu
- [ ] `services/user_service.py` – `register()` metodu
- [ ] `api/v1/auth/router.py` – FastAPI endpoint
- [ ] `schemas/auth.py` – RegisterRequest, RegisterResponse DTO
- [ ] `tests/unit/test_user_service.py` – Unit testler
- [ ] `tests/integration/test_auth_api.py` – Integration testler

### 💻 Örnek Kod

```python
# services/user_service.py
class UserService:
    async def register(self, data: RegisterRequest) -> RegisterResponse:
        # 1. Email benzersizlik kontrolü
        existing = await self._user_repo.find_by_email(data.email)
        if existing:
            raise EmailAlreadyExistsError(f"Email {data.email} zaten kayıtlı.")
        
        # 2. Şifreyi hash'le
        hashed_password = self._password_service.hash(data.password)
        
        # 3. Kullanıcı oluştur
        user = User(
            name=data.name,
            email=data.email,
            password=hashed_password,
            role=UserRole.USER
        )
        saved_user = await self._user_repo.create(user)
        
        # 4. Token üret ve döndür
        return self._token_service.create_token_pair(saved_user)
```

---

## Issue #2: Hayvan Filtreleme Arayüzü Geliştirme

**Başlık:** `[FEATURE] Hayvanlar sayfasına gelişmiş filtreleme paneli eklenmesi`

**Etiketler:** `feature`, `frontend`, `ui/ux`, `priority:medium`

**Atanan:** Frontend Geliştirici

**Milestone:** Sprint 2 – Hayvan Yönetimi

---

### 📝 Açıklama

`animals.html` sayfasında kullanıcıların hayvanları kolayca bulabilmesi için sol tarafta bir filtre paneli oluşturulmalıdır.
Filtreler gerçek zamanlı olarak uygulanmalı (sayfa yenilemesi olmadan).

### ✅ Kabul Kriterleri (Acceptance Criteria)

- [ ] Tür filtresi: Köpek, Kedi, Kuş, Diğer (checkbox, çoklu seçim)
- [ ] Yaş aralığı filtresi: Yavru (0-2), Yetişkin (2-7), Yaşlı (7+)
- [ ] Cinsiyet filtresi: Erkek, Dişi (radio button)
- [ ] Durum filtresi: Sahiplenilebilir, Beklemede, Sahiplenildi
- [ ] Arama kutusu: İsim veya ırk ile arama
- [ ] "Filtreleri Temizle" butonu tüm filtreleri sıfırlamalı
- [ ] Filtre uygulandığında sonuç sayısı güncellenmeli
- [ ] Mobil görünümde filtre paneli açılır/kapanır olmalı
- [ ] Filtre değişikliklerinde URL query parametreleri güncellenmeli (bookmark desteği)

### 📋 Görevler (Tasks)

- [ ] `animals.html` – Filtre sidebar HTML yapısı
- [ ] `assets/js/animals.js` – `applyFilters()` fonksiyonu
- [ ] `assets/js/animals.js` – URL query param senkronizasyonu
- [ ] `assets/css/style.css` – Mobil filtre panel animasyonu
- [ ] Manuel test: Tüm filtre kombinasyonları test edilmeli

### 🎨 UI Gereksinimleri

- Filtre paneli sol tarafta, `w-64` genişliğinde
- Her filtre grubu arasında `mb-5` boşluk
- Checkbox ve radio button'lar `accent-purple-600` rengi
- "Filtreleri Temizle" butonu `border border-gray-200` stili
- Mobil'de `<lg` breakpoint'te filtre paneli gizlenmeli, toggle butonu görünmeli

---

## Issue #3: Sahiplenme Talebi İş Mantığı (Business Logic)

**Başlık:** `[FEATURE] AdoptionService.create_adoption_request() implementasyonu`

**Etiketler:** `feature`, `backend`, `business-logic`, `priority:high`

**Atanan:** Backend Geliştirici

**Milestone:** Sprint 2 – Sahiplenme Süreci

---

### 📝 Açıklama

Sahiplenme talebinin oluşturulması için gerekli iş mantığı `AdoptionService` sınıfında implement edilmelidir.
Bu servis, Clean Architecture'ın Application katmanında yer alır ve Domain katmanındaki entity'leri kullanır.

### ✅ Kabul Kriterleri (Acceptance Criteria)

- [ ] Yalnızca `status=AVAILABLE` olan hayvanlar için talep oluşturulabilmeli
- [ ] Aynı kullanıcı aynı hayvan için birden fazla aktif talep oluşturamamalı
- [ ] Talep oluşturulduğunda hayvanın durumu `PENDING` olarak güncellenmeli
- [ ] Tüm işlemler atomik olmalı (transaction yönetimi)
- [ ] Hata durumlarında anlamlı exception mesajları fırlatılmalı
- [ ] Unit testlerde repository'ler mock'lanmalı (gerçek DB bağlantısı olmamalı)

### 📋 Görevler (Tasks)

- [ ] `domain/enums.py` – `AdoptionStatus`, `AnimalStatus` enum'ları
- [ ] `domain/exceptions.py` – `AnimalNotAvailableError`, `DuplicateRequestError`
- [ ] `repositories/interfaces/i_adoption_repository.py` – Interface
- [ ] `services/adoption_service.py` – `create_adoption_request()` metodu
- [ ] `services/adoption_service.py` – `approve_adoption_request()` metodu
- [ ] `tests/unit/test_adoption_service.py` – Unit testler (mock repository ile)

### 💻 Örnek Servis Kodu

```python
# services/adoption_service.py
class AdoptionService:
    def __init__(
        self,
        adoption_repo: IAdoptionRepository,
        animal_repo: IAnimalRepository
    ):
        # Dependency Inversion: Interface'e bağımlı, concrete sınıfa değil
        self._adoption_repo = adoption_repo
        self._animal_repo = animal_repo

    async def create_adoption_request(
        self, user_id: int, animal_id: int, message: str = None
    ) -> AdoptionRequest:
        animal = await self._animal_repo.get_by_id(animal_id)
        if animal.status != AnimalStatus.AVAILABLE:
            raise AnimalNotAvailableError(
                f"Hayvan {animal_id} sahiplenilebilir durumda değil."
            )
        # ... (devamı için api-docs.html'e bakın)
```

### 🧪 Örnek Test Kodu

```python
# tests/unit/test_adoption_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from services.adoption_service import AdoptionService
from core.exceptions import AnimalNotAvailableError

@pytest.mark.asyncio
async def test_create_request_raises_when_animal_not_available():
    # Arrange
    mock_animal_repo = AsyncMock()
    mock_animal_repo.get_by_id.return_value = MagicMock(
        status=AnimalStatus.ADOPTED  # Hayvan zaten sahiplenilmiş
    )
    mock_adoption_repo = AsyncMock()
    service = AdoptionService(mock_adoption_repo, mock_animal_repo)

    # Act & Assert
    with pytest.raises(AnimalNotAvailableError):
        await service.create_adoption_request(user_id=1, animal_id=5)
```

---

*Bu şablonlar GitHub Issues veya Jira ticket'ları olarak kullanılabilir.*
*PawShelter – Yazılım Mimarisi Dersi Projesi | Mayıs 2024*
