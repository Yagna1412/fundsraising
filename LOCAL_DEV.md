# MyFundraiser — local development

## Stack overview

| Service | Port | Role |
|---------|------|------|
| React frontend | `3000` | UI |
| Spring Boot API | `8080` | Campaigns, donations, profile, **admin APIs** |
| Keycloak | `8081` | Login / JWT issuer |
| MySQL | `3306` | App database |

Admin realtime WebSocket (old Node `:4000`) is optional; admin data now comes from Spring Boot.

## 1. Start MySQL

Ensure MySQL is running (database `Funds` is created automatically).

## 2. Start Keycloak (optional but recommended)

### Option A — without Docker (already installed)

Keycloak is installed at `C:\Users\yagna\keycloak\keycloak-26.7.0`.

Start it anytime:
```powershell
cd d:\desktop\fullstackproject\my-project
.\start-keycloak.ps1
```

Or manually:
```powershell
$env:KEYCLOAK_ADMIN="admin"
$env:KEYCLOAK_ADMIN_PASSWORD="admin"
cd C:\Users\yagna\keycloak\keycloak-26.7.0
.\bin\kc.bat start-dev --http-port=8081 --hostname-strict=false --import-realm
```

Then restart Spring Boot (Keycloak is enabled in `application.properties`):
```powershell
cd C:\Users\yagna\IdeaProjects\fullstack
mvn spring-boot:run
```

### Option B — Docker

Requires **Docker Desktop**. From `d:\desktop\fullstackproject\my-project`:

```bash
docker compose up -d keycloak
```

Without Keycloak running, set `app.keycloak.enabled=false` so the API can start and use local login.

- Console: http://localhost:8081  
- Realm: `myfundraiser` (imported from `keycloak/realm-myfundraiser.json`)  
- Client: `myfundraiser-frontend`  
- Demo users: `user@myfundraiser.com` / `MyFundraiser#User2026`, `admin@myfundraiser.com` / `MyFundraiser#Admin2026`

## 3. Start Spring Boot

From `c:\Users\yagna\IdeaProjects\fullstack`:

**Without Keycloak (default):**
```bash
mvn spring-boot:run
```

**With Keycloak JWT enforcement:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=keycloak
```

API: **http://localhost:8080/api**

### Admin endpoints (require Keycloak JWT with role `ADMIN`)

| Method | Path |
|--------|------|
| GET | `/api/admin/health` |
| GET | `/api/admin/reports/{daily\|weekly\|monthly}` |
| GET | `/api/admin/payments` |
| GET | `/api/admin/users/profiles` |
| GET/POST | `/api/admin/security/events` |
| POST | `/api/admin/donations/simulate` |

### Auth

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/sync` | Upserts local user from Keycloak JWT (Bearer required) |
| POST | `/api/auth/register` | Local DB register (still available) |
| POST | `/api/auth/login` | Legacy password login (no JWT) |

## 4. Start React

```bash
npm install
npm start
```

App: **http://localhost:3000**

## Demo credentials (Keycloak + seeded MySQL)

| Role  | Email                   | Password                 |
|-------|-------------------------|--------------------------|
| User  | `user@myfundraiser.com`   | `MyFundraiser#User2026`  |
| Admin | `admin@myfundraiser.com`  | `MyFundraiser#Admin2026` |

Login flow: React → Keycloak password grant → JWT stored → `POST /api/auth/sync` → redirect.

## Env vars

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_KEYCLOAK_URL=http://localhost:8081
REACT_APP_KEYCLOAK_REALM=myfundraiser
REACT_APP_KEYCLOAK_CLIENT_ID=myfundraiser-frontend
```
