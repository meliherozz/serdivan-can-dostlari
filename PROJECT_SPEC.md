# PROJECT_SPEC.md — Serdivan Can Dostları

## 1. Proje adı

**Serdivan Can Dostları — Dijital Hayvan Sahiplendirme Platformu**

Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi için vatandaşların sahiplendirilebilir hayvanları görüntüleyebildiği ve online sahiplendirme başvurusu yapabildiği web platformu.

---

## 2. Temel amaç

Platform iki ana kullanıcı grubuna hizmet eder.

### Vatandaş

* Sahiplendirilebilir hayvanları görüntüler.
* Kedi/köpek, cinsiyet, yaş ve boyuta göre filtreler.
* Hayvanın detaylarını ve fotoğraflarını görür.
* "Sahiplenmek İstiyorum" butonuyla başvuru yapar.
* Başvuru sonrası referans numarası alır.

### Belediye personeli

Strapi Admin üzerinden:

* Hayvan ekler.
* Fotoğraf yükler.
* Hayvan bilgilerini düzenler.
* Hayvanın sahiplendirme durumunu değiştirir.
* Gelen başvuruları görüntüler.
* Başvuruyu değerlendirir.
* Onaylanan hayvanı "Sahiplendirildi" olarak işaretler.

---

# 3. Teknoloji

## Backend

* Strapi 5
* TypeScript
* PostgreSQL
* REST API

## Frontend

* Next.js
* App Router
* TypeScript
* Tailwind CSS

## Database

* PostgreSQL
* Local development için Docker Compose

## Package manager

* npm

---

# 4. Repository yapısı

```text
serdivan-can-dostlari/
│
├── AGENTS.md
├── PROJECT_SPEC.md
├── README.md
├── package.json
├── docker-compose.yml
├── .gitignore
│
├── backend/
│   └── Strapi
│
└── frontend/
    └── Next.js
```

---

# 5. Strapi veri modelleri

## Animal

Alanlar:

```text
name                string, required
slug                UID(name), required

species             enum
                    dog
                    cat
                    other

gender              enum
                    male
                    female
                    unknown

ageGroup            enum
                    baby
                    young
                    adult
                    senior

size                enum
                    small
                    medium
                    large

estimatedBirthDate  date, optional

shortDescription    text
description         richtext/text

personality         text

vaccinated          boolean
neutered            boolean
microchipped        boolean

adoptionStatus      enum
                    available
                    reserved
                    adopted
                    unavailable

featured            boolean

arrivalDate         date

featuredImage       media, single
images              media, multiple

breed               many-to-one -> Breed

healthRecords       one-to-many -> HealthRecord

applications        one-to-many -> AdoptionApplication
```

Animal için Draft & Publish aktif olmalıdır.

Sadece yayınlanmış hayvanlar vatandaş tarafında görünmelidir.

---

## Breed

```text
name        string
species     enum: dog / cat / other
animals     one-to-many -> Animal
```

---

## HealthRecord

Bu collection vatandaş API'sinde kesinlikle yayınlanmamalıdır.

```text
animal          many-to-one -> Animal
recordDate      date
recordType      enum

                examination
                vaccination
                treatment
                surgery
                other

description     text
veterinarian    string, optional
internalNotes   text, optional
```

Bu veriler yalnızca belediye personeli içindir.

---

## AdoptionApplication

```text
referenceCode       string, unique

animal              many-to-one -> Animal

fullName            string
phone               string
email               email

city                 string
district             string

housingType          enum
                     apartment
                     house
                     other

hasGarden            boolean
hasOtherPets         boolean

otherPetsDescription text, optional

previousPetExperience
                     text, optional

reasonForAdoption    text

consentAccepted      boolean

status               enum
                     new
                     reviewing
                     contacted
                     approved
                     rejected
                     cancelled

internalNotes        text

createdAt
updatedAt
```

`status` istemci tarafından belirlenemez.

Yeni başvuru oluşturulduğunda otomatik:

```text
status = new
```

olmalıdır.

`referenceCode` backend tarafından üretilmelidir.

Örnek:

```text
SRD-2026-A8F42C
```

---

# 6. ShelterInfo — Single Type

```text
name
description
address
phone
email
workingHours
latitude
longitude
heroImage
gallery
```

Başlangıç değeri:

```text
Serdivan Belediyesi
Sahipsiz Hayvanlar Bakımevi
```

Gerçek iletişim bilgileri demo aşamasında uydurulmamalıdır.

Placeholder kullanılabilir.

---

# 7. FAQ

```text
question
answer
order
published
```

Örnek sorular:

* Hayvan sahiplenmek ücretli mi?
* Başvurudan sonra süreç nasıl ilerliyor?
* Bakımevini ziyaret edebilir miyim?
* Aynı anda birden fazla hayvan için başvurabilir miyim?

Cevaplar demo metni olarak açık şekilde işaretlenmelidir.

---

# 8. Frontend sayfaları

## `/`

Ana sayfa.

İçerik:

```text
Hero

"Bir Can Dostuna Yuva Ol"

[Can Dostlarımızı Gör]
```

Altında:

* Öne çıkan hayvanlar
* Nasıl çalışır?
* Bakımevi hakkında kısa bilgi
* Sahiplenme süreci
* SSS
* Footer

---

## `/can-dostlarimiz`

Hayvan kataloğu.

Filtreler:

```text
Tür
Kedi / Köpek

Cinsiyet
Erkek / Dişi

Yaş
Yavru / Genç / Yetişkin / Yaşlı

Boyut
Küçük / Orta / Büyük
```

Kart:

```text
┌────────────────────┐
│                    │
│       FOTOĞRAF     │
│                    │
├────────────────────┤
│ PAMUK              │
│                    │
│ 🐕 Köpek           │
│ ♀ Dişi             │
│ Genç               │
│                    │
│ [Detayları Gör]    │
└────────────────────┘
```

---

## `/can-dostlarimiz/[slug]`

Hayvan detay sayfası.

Göster:

* Büyük fotoğraf
* Galeri
* İsim
* Tür
* Cins
* Cinsiyet
* Tahmini yaş
* Boyut
* Karakter
* Açıklama
* Aşı durumu
* Kısırlaştırma durumu
* Mikroçip durumu
* Sahiplendirme durumu

Ana CTA:

```text
❤️ Sahiplenmek İstiyorum
```

---

## `/sahiplen/[slug]`

Sahiplendirme başvuru formu.

Kullanıcı hangi hayvan için başvurduğunu açıkça görmelidir.

Form alanları PROJECT_SPEC içerisindeki AdoptionApplication modeline uygun olmalıdır.

Gönderim öncesinde:

```text
[ ] Kişisel verilerimin bu başvurunun
    değerlendirilmesi amacıyla işlenmesine
    ilişkin bilgilendirmeyi okudum.
```

Demo aşamasında hukuki metin uydurulmamalıdır.

Şu şekilde göster:

```text
"KVKK/Aydınlatma metni belediye tarafından
onaylandıktan sonra bu alana eklenecektir."
```

---

## `/basvuru-basarili`

Başarı ekranı.

Örnek:

```text
Başvurunuz Alındı ❤️

Başvuru Numaranız

SRD-2026-A8F42C

Serdivan Belediyesi ilgili birimi
başvurunuzu değerlendirecektir.
```

---

## `/bakimevi`

Bakımevi tanıtım sayfası.

Strapi `ShelterInfo` üzerinden beslenmelidir.

---

## `/sss`

Strapi FAQ collection üzerinden gelmelidir.

---

## `/gizlilik`

Demo gizlilik/KVKK placeholder sayfası.

Gerçek hukuki metin oluşturulmamalıdır.

---

# 9. Sahiplendirme workflow'u

```text
Hayvan
AVAILABLE
    ↓
Vatandaş başvurur
    ↓
NEW
    ↓
Belediye inceler
    ↓
REVIEWING
    ↓
Vatandaşla iletişime geçilir
    ↓
CONTACTED
    ↓
Onay
    ↓
APPROVED
    ↓
Animal:
ADOPTED
```

Hayvan `reserved`, `adopted` veya `unavailable` durumundaysa yeni başvuru kabul edilmemelidir.

---

# 10. API güvenliği

Public kullanıcı:

```text
Animal
GET ✅

Breed
GET ✅

FAQ
GET ✅

ShelterInfo
GET ✅

HealthRecord
GET ❌
POST ❌

AdoptionApplication
GET ❌
PUT ❌
DELETE ❌
```

Başvuru için normal Strapi CRUD endpoint'ini public yapmak yerine özel endpoint oluştur:

```text
POST /api/adoption-applications/submit
```

Endpoint yalnızca gerekli form alanlarını kabul etmelidir.

Client tarafından gönderilen:

```text
status
internalNotes
referenceCode
```

alanları yok sayılmalıdır.

Backend bunları kendisi oluşturmalıdır.

---

# 11. Başvuru güvenliği

Formda:

* server-side validation
* input sanitization
* email validation
* telefon validation
* max length kontrolleri
* honeypot spam alanı
* temel rate limiting

uygulanmalıdır.

Ham hata mesajları kullanıcıya gösterilmemelidir.

---

# 12. Gizlilik prensibi

MVP için aşağıdaki veriler toplanmayacaktır:

```text
TC Kimlik Numarası
Doğum tarihi
Açık ev adresi
Sağlık bilgisi
Finansal bilgi
Kimlik fotoğrafı
e-Devlet bilgisi
```

Sadece sahiplendirme değerlendirmesi için gereken minimum iletişim bilgileri tutulacaktır.

Gerçek belediye kullanımı öncesinde veri alanları ve hukuki metinler belediyenin yetkili birimleri tarafından ayrıca onaylanmalıdır.

---

# 13. Tasarım

Tasarım:

* modern
* sade
* sıcak
* güven veren
* belediye kurumsal uygulamasına uygun
* mobil öncelikli
* erişilebilir

olmalıdır.

Aşırı animasyon kullanılmamalıdır.

Resmî belediye logosu veya telifli görseller internetten otomatik indirilmemelidir.

İlk sürümde text logo kullanılabilir:

```text
Serdivan Belediyesi
CAN DOSTLARI
```

---

# 14. Demo verileri

Seed sistemi oluştur.

En az:

```text
8 hayvan
5 köpek
3 kedi

6 breed

1 shelter info

6 FAQ
```

oluştur.

Hayvan isimleri örneğin:

```text
Pamuk
Tarçın
Boncuk
Maya
Zeytin
Duman
Luna
Fındık
```

Gerçek belediye kayıtları gibi gösterilmemelidir.

Demo oldukları README'de belirtilmelidir.

---

# 15. Responsive

Aşağıdaki boyutlarda düzgün çalışmalıdır:

```text
Mobile
Tablet
Desktop
```

---

# 16. Accessibility

* Semantic HTML
* Keyboard navigation
* Form label
* Visible focus state
* Alt text
* Yeterli kontrast
* Screen reader uyumlu hata mesajları

uygulanmalıdır.

---

# 17. Local development

PostgreSQL Docker Compose ile ayağa kaldırılmalıdır.

Önerilen development akışı:

```text
docker compose up -d

backend:
npm run develop

frontend:
npm run dev
```

Root seviyesinde mümkünse kolaylaştırıcı script oluştur:

```text
npm run dev
```

ile frontend + backend çalıştırılabilsin.

---

# 18. Environment

Repository'ye gerçek secret commit edilmemelidir.

Şunları oluştur:

```text
backend/.env.example
frontend/.env.example
```

`.env` dosyalarını `.gitignore` içine ekle.

---

# 19. README

README aşağıdakileri içermelidir:

* Proje açıklaması
* Mimari
* Gereksinimler
* Kurulum
* PostgreSQL kurulumu
* Backend çalıştırma
* Frontend çalıştırma
* Strapi Admin oluşturma
* Seed data
* Environment değişkenleri
* Kullanılan teknolojiler
* Demo veri uyarısı
* Production'a geçmeden önce yapılması gerekenler

---

# 20. MVP dışında kalanlar

Şimdilik YAPILMAYACAK:

```text
e-Devlet entegrasyonu
SMS
WhatsApp
Gerçek e-posta gönderimi
Vatandaş üyeliği
OAuth
TC kimlik doğrulama
Belediye ERP entegrasyonu
Mobil uygulama
AI
Veteriner otomasyonu
Ödeme
Harita tabanlı hayvan bulma
Push notification
```

Bunlar V2/V3 olabilir.

---

# 21. Definition of Done

MVP tamamlanmış kabul edilmesi için:

* PostgreSQL çalışıyor.
* Strapi ayağa kalkıyor.
* Strapi Admin kullanılabiliyor.
* Demo hayvanlar görüntüleniyor.
* Next.js ana sayfası çalışıyor.
* Hayvan listesi Strapi'den geliyor.
* Filtreler çalışıyor.
* Detay sayfası çalışıyor.
* Fotoğraflar görüntüleniyor.
* Başvuru formu çalışıyor.
* Başvuru Strapi database'e kaydediliyor.
* Referans kodu backend tarafından oluşturuluyor.
* Belediye personeli başvuruyu Strapi Admin'de görüyor.
* HealthRecord public API'den erişilemiyor.
* AdoptionApplication listesi public API'den erişilemiyor.
* Build hatasız tamamlanıyor.
* TypeScript hatası bulunmuyor.
* README kurulumu sıfırdan anlatıyor.
