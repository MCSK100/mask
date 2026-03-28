# Mask Chat (Anonymous Chat + Video)

Anonymous stranger chat/video platform inspired by Omegle:
- random matching queue
- text chat
- WebRTC video call signaling
- next stranger flow
- live online user count
- dark animated UI buttons
- optional Google Ads slots for revenue

## Local setup

### 1) Install

From `mask`:

```bash
npm install
cd server
npm install
```

### 2) Configure env files

Create `mask/.env`:

```env
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_ADS_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
VITE_GOOGLE_AD_SLOT_CHAT=1234567890
VITE_GOOGLE_AD_SLOT_VIDEO=1234567890
```

Create `mask/server/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### 3) Run

From `mask`:

```bash
npm run dev:all
```

Or separately:

```bash
npm run dev
npm --prefix ./server run dev
```

## Production deployment (free tiers)

Recommended free setup:
- **Frontend:** Vercel (free)
- **Backend socket server:** Render web service (free, sleeps when idle)

### A) Deploy backend on Render

1. Push project to GitHub.
2. Create new Render Web Service from repo.
3. Set root directory to `mask/server`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add env:
   - `PORT=5000`
   - `CORS_ORIGIN=https://YOUR-FRONTEND-DOMAIN.vercel.app`
7. Deploy and copy backend URL, e.g. `https://mask-server.onrender.com`

### B) Deploy frontend on Vercel

1. Import same repo in Vercel.
2. Set root directory to `mask`.
3. Framework preset: Vite.
4. Add env:
   - `VITE_SOCKET_URL=https://mask-server.onrender.com`
   - `VITE_GOOGLE_ADS_CLIENT=ca-pub-...`
   - `VITE_GOOGLE_AD_SLOT_CHAT=...`
   - `VITE_GOOGLE_AD_SLOT_VIDEO=...`
5. Deploy.

### C) Update backend CORS

After frontend deploy, update Render:
- `CORS_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app`

Redeploy backend.

## Google AdSense notes

- Ads only start after AdSense approval.
- Keep ad component but expect blank slots until approved.
- Add legal pages before approval: Privacy Policy, Terms, Contact.

## Troubleshooting

- If online count is `0` or next stranger fails:
  - confirm backend is running
  - confirm frontend `VITE_SOCKET_URL` points to backend
  - check browser console for socket connection errors
- If video fails:
  - allow camera/mic permissions
  - use HTTPS domains in production
  - avoid browser extensions that block WebRTC/ads
