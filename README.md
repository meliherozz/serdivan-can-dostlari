# Serdivan Can Dostları

Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi için dijital hayvan sahiplendirme platformu MVP prototipi.

Bu repository demo/prototip amaçlıdır. Seed verileri kurgusaldır; gerçek vatandaş verisi, gerçek belediye kaydı veya production sistem bağlantısı içermez.

## Architecture

- `backend/`: Strapi 5, TypeScript, REST API, PostgreSQL
- `frontend/`: Next.js App Router, TypeScript, Tailwind CSS
- `docker-compose.yml`: local PostgreSQL 16 container ve persistent volume

Strapi Admin belediye personeli arayüzüdür. MVP için ayrı bir custom admin dashboard yoktur.

## Requirements

- Node.js `22.x` veya Strapi 5 ile uyumlu güncel LTS
- npm
- Docker Desktop
- Git

Windows PowerShell execution policy `npm.ps1` çalışmasını engellerse komutları `npm.cmd` ile çalıştırabilirsiniz.

## Installation

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

Scaffold sırasında bağımlılıklar kurulmuşsa tekrar kurmak gerekmez.

## PostgreSQL

```bash
docker compose up -d
```

Varsayılan local değerler:

- Database: `serdivan_can_dostlari`
- User: `strapi`
- Password: `change_me_for_local_dev`
- Port: `5432`

Veri `serdivan_postgres_data` Docker volume içinde saklanır.

## Environment Variables

Gerçek `.env` dosyaları commit edilmez.

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

`backend/.env` içindeki secret placeholder değerlerini local geliştirme için üretin:

```bash
cd backend
npm run strapi -- keys:generate
```

Ardından değerleri `.env` içine yerleştirin.

## Strapi

Backend geliştirme:

```bash
npm --prefix backend run develop
```

Strapi Admin:

```text
http://localhost:1337/admin
```

İlk açılışta admin kullanıcısını manuel oluşturmanız gerekir.

## Seed Data

Demo seed çalıştırmak için PostgreSQL açıkken:

```bash
npm run seed
```

Bu komut backend’i `SEED_DEMO_DATA=true` ile başlatır. Seed idempotent olacak şekilde hazırlanmıştır; aynı kayıtları kontrolsüz çoğaltmaz.

Seed içeriği:

- 8 kurgusal hayvan
- 6 breed
- 6 FAQ
- 1 ShelterInfo

## Next.js

Frontend geliştirme:

```bash
npm --prefix frontend run dev
```

Frontend:

```text
http://localhost:3000
```

## Development

Root seviyesinden frontend ve backend birlikte:

```bash
npm run dev
```

Önce PostgreSQL container’ının açık olduğundan emin olun.

## Build And Checks

```bash
npm --prefix backend run build
npm --prefix frontend run lint
npm --prefix frontend run typecheck
npm --prefix frontend run build
```

Bu çalışma sırasında geçen kontroller:

- Backend Strapi build
- Frontend lint
- Frontend TypeScript typecheck
- Frontend production build

Canlı API smoke testleri için Docker Desktop’ın çalışır durumda olması gerekir.

## Security Notes

- Public başvuru CRUD API izinleri açılmamalıdır.
- Başvuru için özel endpoint kullanılır: `POST /api/adoption-applications/submit`
- Endpoint client’tan gelen `status`, `referenceCode`, `internalNotes`, `createdAt`, `updatedAt` değerlerine güvenmez.
- `referenceCode` backend tarafından üretilir.
- Yeni başvurular `status = new` ile oluşturulur.
- `adoptionStatus !== available` olan hayvanlara başvuru reddedilir.
- HealthRecord public API’ye açılmamalıdır.
- AdoptionApplication liste ve detay endpointleri public API’ye açılmamalıdır.
- Formda honeypot, server-side validation, max length kontrolleri, telefon/e-posta kontrolü ve basit rate limit vardır.

## Production Checklist

- Resmi KVKK/Aydınlatma metinlerini belediye onayından sonra ekleyin.
- Gerçek iletişim ve bakımevi bilgilerini yetkili kaynakla doğrulayın.
- Production secret değerlerini güvenli secret manager üzerinden yönetin.
- Public role izinlerini Strapi Admin üzerinden tekrar doğrulayın.
- PostgreSQL yedekleme ve erişim kontrollerini production ortamına göre yapılandırın.
- Resmi logo/görsel varlıkları yalnızca belediye tarafından sağlandığında ekleyin.
