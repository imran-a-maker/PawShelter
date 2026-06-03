# ✅ Kod İnceleme Kontrol Listesi (Code Review Checklist)

> PawShelter projesi için Pull Request incelemelerinde kullanılacak kontrol listesi.
> Her PR açılmadan önce bu liste gözden geçirilmelidir.

---

## 1. Genel Kod Kalitesi

- [ ] **1.1** Kod okunabilir ve anlaşılır mı? Karmaşık mantık için yorum satırları eklenmiş mi?
- [ ] **1.2** Fonksiyon ve değişken isimleri açıklayıcı ve tutarlı mı? (snake_case Python, camelCase JS)
- [ ] **1.3** Tekrar eden kod (DRY – Don't Repeat Yourself) prensibi ihlal ediliyor mu?
- [ ] **1.4** Fonksiyonlar tek bir sorumluluğa sahip mi? (SRP – Single Responsibility Principle)
- [ ] **1.5** Magic number veya string kullanımı var mı? Sabitler tanımlanmış mı?
- [ ] **1.6** Kullanılmayan import, değişken veya fonksiyon var mı?
- [ ] **1.7** Hata yönetimi (exception handling) uygun şekilde yapılmış mı?
- [ ] **1.8** Loglama yeterli mi? Hassas bilgiler (şifre, token) loglanıyor mu?
- [ ] **1.9** Kod, proje stil rehberine (PEP 8 / ESLint kuralları) uygun mu?
- [ ] **1.10** Performans açısından belirgin bir sorun var mı? (N+1 sorgu, gereksiz döngü vb.)

---

## 2. Güvenlik Kontrolleri

- [ ] **2.1** Kullanıcı girdileri doğrulanıyor ve sanitize ediliyor mu? (SQL injection, XSS riski)
- [ ] **2.2** Kimlik doğrulama gerektiren endpoint'ler korunuyor mu? (`get_current_user` dependency)
- [ ] **2.3** Yetkilendirme kontrolleri doğru mu? (Admin-only endpoint'ler `require_admin` ile korunuyor mu?)
- [ ] **2.4** Hassas veriler (şifre, token, API key) kaynak kodda açık mı? `.env` kullanılıyor mu?
- [ ] **2.5** Şifreler bcrypt ile hash'leniyor mu? Plain text şifre saklanıyor mu?
- [ ] **2.6** JWT token süresi uygun mu? (Access: 30 dk, Refresh: 7 gün)
- [ ] **2.7** CORS ayarları production için kısıtlı mı? (`*` yerine belirli origin'ler)
- [ ] **2.8** Rate limiting uygulanmış mı? (Özellikle auth endpoint'leri için)

---

## 3. Mimari Uyumluluk

- [ ] **3.1** Değişiklik Clean Architecture katman kurallarına uyuyor mu? (Bağımlılık yönü doğru mu?)
- [ ] **3.2** Domain katmanına dış bağımlılık (SQLAlchemy, FastAPI vb.) eklendi mi? (Eklenmemeli!)
- [ ] **3.3** Servis katmanı doğrudan veritabanı modeline mi bağımlı, yoksa repository interface'ine mi?
- [ ] **3.4** Yeni bir repository eklendiyse interface (`IRepository`) tanımlanmış mı?
- [ ] **3.5** DTO'lar (Request/Response) Presentation katmanında mı tanımlanmış?
- [ ] **3.6** İş mantığı Controller içine sızmış mı? (Fat Controller antipattern)

---

## 4. Test Kapsamı

- [ ] **4.1** Yeni eklenen iş mantığı için unit test yazılmış mı?
- [ ] **4.2** Repository mock'ları kullanılarak servis testleri izole edilmiş mi?
- [ ] **4.3** Edge case'ler (boş liste, null değer, sınır değerleri) test edilmiş mi?
- [ ] **4.4** Hata senaryoları (exception fırlatma durumları) test edilmiş mi?
- [ ] **4.5** Test coverage %80'in altına düştü mü? (`pytest --cov` ile kontrol et)

---

## 5. Dokümantasyon

- [ ] **5.1** Yeni endpoint'ler için docstring eklenmiş mi? (FastAPI otomatik Swagger üretir)
- [ ] **5.2** Karmaşık iş mantığı için inline yorum satırları yeterli mi?
- [ ] **5.3** README.md güncellenmesi gerekiyor mu? (Yeni özellik, kurulum adımı vb.)
- [ ] **5.4** Mimari kararı etkileyen bir değişiklik varsa yeni ADR oluşturuldu mu?

---

## 📝 PR Açıklaması Şablonu

```markdown
## Değişiklik Özeti
<!-- Ne değişti? Neden? -->

## Test Edildi
- [ ] Unit testler geçiyor (`pytest`)
- [ ] Manuel test yapıldı
- [ ] Linter hata yok (`flake8` / `eslint`)

## Ekran Görüntüsü (UI değişikliği varsa)
<!-- Önce / Sonra ekran görüntüsü -->

## İlgili Issue
Closes #XXX
```

---

*Son güncelleme: Mayıs 2024 | PawShelter Yazılım Mimarisi Projesi*
