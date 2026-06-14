# MyHuette — Backend + Frontend

AI-powered clothing color search. This repo contains both the frontend (`public/index.html`) and a serverless API proxy (`api/claude.js`) that keeps your Anthropic API key secure on the server.

---

## How it works

```
Browser  →  POST /api/claude  →  Vercel Function  →  Anthropic API
                                  (key lives here)
```

The frontend never sees the API key. Every AI call goes through `/api/claude`, which adds the key server-side before forwarding to Anthropic.

---

## Deploy to Vercel (free, ~2 minutes)

### Step 1 — Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in → **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-`)

### Step 2 — Deploy to Vercel
**Option A — GitHub (recommended)**
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Click **Deploy** (no build settings needed)

**Option B — Vercel CLI**
```bash
npm install -g vercel
cd chromafit-backend
vercel --prod
```

### Step 3 — Add your API key
1. In the Vercel dashboard, open your project
2. Go to **Settings → Environment Variables**
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-your-key-here`
   - **Environments:** Production, Preview, Development ✓
4. Click **Save**
5. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

That's it — your site is live at `https://your-project.vercel.app` with all AI features working.

---

## Local development

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Create your local env file
cp .env.example .env.local
# Edit .env.local and add your real key

# 3. Run locally (simulates Vercel serverless functions)
vercel dev
# → Open http://localhost:3000
```

---

## File structure

```
chromafit-backend/
├── api/
│   └── claude.js        ← Serverless function (Anthropic proxy)
├── public/
│   └── index.html       ← Full ChromaFit frontend
├── .env.example         ← Copy to .env.local for local dev
├── .gitignore
├── package.json
├── vercel.json          ← Routing config
└── README.md
```

---

## Custom domain

1. Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `chromafit.com`)
3. Follow the DNS instructions (usually just a CNAME record)

Done — HTTPS is automatic.

---

## Security notes

- The API key is **never** in the frontend code or browser
- CORS is set to `*` by default — change to your domain in `api/claude.js` line 5 for production:
  ```js
  res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
  ```
- Vercel's free tier includes 100GB bandwidth and 100k function invocations/month — more than enough for personal use

---

## Tech stack

- **Frontend:** Vanilla HTML/CSS/JS (no build step)
- **Backend:** Vercel Serverless Functions (Node.js 18)
- **AI:** Anthropic Claude Sonnet 4.6
- **Hosting:** Vercel (free tier)
