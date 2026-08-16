# Pulse SMS — Vercel deployment

Deploy the dashboard UI on **Vercel**. The API runs on Render at `https://bulk-sms-campaing.onrender.com`.

## Vercel project settings

Use **one** of these setups (not both):

### Option A — Root Directory = `frontend` (recommended)

| Setting | Value |
| -------- | ----- |
| Root Directory | `frontend` |
| Framework Preset | TanStack Start |
| Build Command | `npm run build` |
| Output Directory | *(leave empty — auto-detected at `.vercel/output`)* |
| Install Command | `npm install` |
| Node.js Version | 20.x |

`frontend/vercel.json` is used automatically.

### Option B — Root Directory = `.` (repo root)

| Setting | Value |
| -------- | ----- |
| Root Directory | `.` (empty / repo root) |
| Framework Preset | TanStack Start |
| Build Command | *(leave empty — uses root `vercel.json`)* |
| Output Directory | *(leave empty — uses root `vercel.json`)* |

Root `vercel.json` builds `frontend/` and deploys `frontend/dist`.

## Environment variables

Production + Preview:

| Variable | Value |
| -------- | ----- |
| `VITE_API_BASE_URL` | `https://bulk-sms-campaing.onrender.com/v1` |
| `VITE_RAZORPAY_KEY_ID` | *(optional)* Razorpay public key |

After deploy, on **Render** set:

- `CORS_ORIGIN` = `https://your-app.vercel.app`
- `APP_FRONTEND_URL` = same URL

## Fix `404 NOT_FOUND`

This error means Vercel has **no route handler** for the request — not an app bug.

### Checklist

1. **Leave Output Directory empty** — do NOT set it to `dist`
   - This is a TanStack Start SSR app. The Nitro `vercel` preset emits the **Build Output API v3**
     (`config.json` + `functions/__server.func/` + `static/`) to **`.vercel/output/`**, which Vercel
     auto-detects. Pointing Output Directory at `dist` makes Vercel serve it as a static folder with no
     root `index.html`, so every route returns `404 NOT_FOUND`.

2. **Remove Production Overrides**
   - Settings → Build & Development → yellow “Production Overrides” warning
   - Clear any override for Output Directory or Root Directory → Save → **Redeploy**.

3. **Build logs must end with**
   ```
   Vercel output verified: .vercel/output/static + functions/__server.func + config.json
   ```

4. **Open your Vercel URL**, not the Render API URL.

5. **Redeploy** after changing env vars or settings (Vite bakes `VITE_*` at build time).

## Local verify before deploy

```bash
cd frontend
npm install
npm run build
```
