# MyFundraiser — local development

## Chrome “Change your password” popup

That dialog is from **Google Password Manager**, not MyFundraiser. It appears when you use passwords known from public data breaches (for example old `admin123`).

**Fix:** use the updated demo credentials on the login page (filled via the **User demo** / **Admin demo** buttons):

| Role  | Email                   | Password                 |
|-------|-------------------------|--------------------------|
| User  | user@myfundraiser.com   | `MyFundraiser#User2026`  |
| Admin | admin@myfundraiser.com  | `MyFundraiser#Admin2026` |

You can dismiss the Chrome popup with **OK** — it does not block the app.

## Run everything locally

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Redis + RabbitMQ via Docker

```bash
npm run infra
```

Management UI: http://localhost:15672 (user `fundraiser`, password `fundraiser`)

If Docker is not running, the platform server still works using in-memory fallbacks.

### 3. Start API + React together

```bash
npm run dev
```

- React app: http://localhost:3000  
- Platform API + WebSocket: http://localhost:4000 (`ws://localhost:4000/ws`)

### Or run separately

```bash
npm run server   # terminal 1
npm start        # terminal 2
```

## Admin dashboard sections

- **Reports** — Daily / Weekly / Monthly tabs (API + Redis cache)
- **Payments** — Settlement table, live updates via WebSocket
- **User Profiles** — Split view profile explorer
- **Security** — Audit log + 2FA/API/session cards
- **Realtime bar** — WebSocket, Redis, and RabbitMQ status

Live donations are simulated every ~12 seconds and pushed through RabbitMQ (or memory queue) to the admin UI.
