# AGENTS.md — Serdivan Can Dostları

## Mission

Build a production-quality MVP prototype for the Serdivan Belediyesi Digital Animal Adoption Platform described in `PROJECT_SPEC.md`.

`PROJECT_SPEC.md` is the source of truth for product requirements.

Do not silently remove or simplify requirements.

---

# Working style

Before making major changes:

1. Read `PROJECT_SPEC.md`.
2. Inspect the existing repository.
3. Determine the smallest safe implementation step.
4. Implement it.
5. Run the relevant checks.
6. Fix errors before continuing.

Do not leave known build, lint or TypeScript errors behind.

---

# Tech stack

Use:

```text
Backend:
Strapi 5
TypeScript

Database:
PostgreSQL

Frontend:
Next.js
App Router
TypeScript
Tailwind CSS

Package manager:
npm
```

Use current stable versions that are mutually compatible.

Do not use deprecated APIs when a current supported API exists.

Before relying on unfamiliar framework behavior, check the current official documentation.

---

# Repository

Expected structure:

```text
/
├── AGENTS.md
├── PROJECT_SPEC.md
├── README.md
├── docker-compose.yml
├── backend/
└── frontend/
```

Do not put frontend code inside the Strapi application.

Do not put Strapi-specific business logic inside the Next.js application unless it is frontend-specific integration code.

---

# Architecture principles

Keep the architecture simple.

Do not introduce:

* microservices
* Kubernetes
* Redis
* message queues
* GraphQL
* event buses
* unnecessary abstraction layers

for the MVP.

Prefer boring, understandable and maintainable code.

---

# Backend rules

Strapi owns:

* Animal content
* Breed content
* Shelter information
* FAQ
* Adoption applications
* Health records
* Media
* Application workflow

Strapi Admin is the municipality staff administration interface.

Do not build a second custom admin dashboard for the MVP.

---

# Data privacy

Never include real citizen information in:

* source code
* seed data
* fixtures
* tests
* screenshots
* README

Never request or store:

* Turkish ID number
* ID photo
* financial information
* medical information
* passwords

for adoption applicants in the MVP.

Use fictional data only.

---

# Adoption application security

Never expose the standard AdoptionApplication CRUD API publicly.

Implement a dedicated submission endpoint.

Expected route concept:

```text
POST /api/adoption-applications/submit
```

The server must explicitly whitelist accepted fields.

Never trust the following client supplied values:

```text
status
referenceCode
internalNotes
createdAt
updatedAt
```

Generate `referenceCode` on the backend.

Always initialize:

```text
status = new
```

Reject an application if the related animal is not currently:

```text
available
```

---

# Public API permissions

The public API may read public/published:

* Animals
* Breeds
* FAQ
* ShelterInfo

The public API must NOT expose:

* adoption application lists
* adoption application details
* health records
* internal notes

Verify this behavior instead of assuming configuration is correct.

---

# Strapi modeling

Use proper Strapi relations rather than manually duplicating foreign IDs.

Relations:

```text
Breed
  1 ───── N Animal

Animal
  1 ───── N HealthRecord

Animal
  1 ───── N AdoptionApplication
```

Use media fields for images.

Animal should support Draft & Publish.

---

# Frontend rules

Use the Next.js App Router.

Prefer Server Components for content-oriented pages.

Use Client Components only where interactivity is actually required, such as:

* filters
* form interactions

Centralize Strapi communication.

Do not scatter raw fetch calls throughout UI components.

Suggested structure:

```text
frontend/src/
├── app/
├── components/
├── lib/
│   └── strapi/
├── types/
└── utils/
```

Create typed interfaces for API data.

---

# UI rules

The interface should be:

* mobile-first
* accessible
* clean
* municipality appropriate
* warm without looking childish
* consistent

Do not copy another municipality website.

Do not automatically download Serdivan Belediyesi branding assets.

Use a temporary text-based identity until official assets are supplied.

---

# Images

Create a reusable Strapi media URL helper.

Handle missing animal images gracefully.

Do not hardcode localhost media URLs throughout components.

---

# Forms

Use server-side validation in addition to client-side validation.

Show Turkish validation messages.

Prevent double submit.

Include loading, success and error states.

Do not display raw backend stack traces or database errors.

Implement a honeypot field and reasonable anti-spam protection.

---

# Environment configuration

Never commit `.env`.

Create `.env.example`.

Secrets must be represented with placeholders.

Do not generate fake production credentials.

---

# Database

Use PostgreSQL for the target development environment.

Use Docker Compose for local PostgreSQL unless the environment already provides a compatible PostgreSQL instance.

Database data should be stored in a Docker volume.

Do not delete existing user database volumes unless explicitly instructed.

---

# Commands

Before installing or executing tools:

* inspect existing files
* inspect package.json
* avoid installing duplicate packages
* use documented CLI commands
* do not guess CLI flags

If an installation command fails because framework CLI syntax changed, inspect the current CLI help/documentation and correct it.

---

# Verification

After backend changes run appropriate checks such as:

```text
Strapi build
TypeScript compilation
```

After frontend changes run:

```text
lint
typecheck
build
```

When a check fails:

1. Read the complete error.
2. Find the root cause.
3. Fix it.
4. Run the check again.

Do not simply suppress TypeScript or ESLint errors.

Avoid:

```text
any
@ts-ignore
eslint-disable
```

unless there is a documented and justified reason.

---

# Seed data

Create repeatable demo seed data.

Seed execution should not accidentally create endless duplicate records.

All seed data must clearly be fictional.

---

# Git safety

Do not:

* force push
* rewrite existing history
* delete branches
* delete unrelated files
* reset user changes

without explicit authorization.

Do not commit secrets.

---

# Scope control

If a feature is explicitly listed under "MVP dışında kalanlar" in `PROJECT_SPEC.md`, do not implement it unless it is required to make the MVP work.

Do not spontaneously add:

* authentication systems
* AI
* SMS
* e-mail providers
* payment providers
* e-Devlet integrations

---

# Documentation

Whenever setup behavior changes, update README.

A new developer must be able to clone the repository and understand:

```text
requirements
installation
database setup
environment setup
backend startup
frontend startup
seed process
Strapi admin setup
```

without reading the implementation.

---

# Subagents

If the current Codex environment supports subagents, they may be used for clearly separable work.

Suggested responsibilities:

```text
backend:
Strapi schemas, API, validation, security

frontend:
Next.js UI and Strapi consumption

qa:
builds, API security checks and smoke tests
```

The primary agent remains responsible for integration and must verify all subagent work.

---

# Definition of quality

Do not optimize for producing the most code.

Optimize for:

```text
correctness
security
simplicity
readability
maintainability
working software
```

A task is not finished merely because files were created.

A task is finished when the feature works and relevant verification passes.
