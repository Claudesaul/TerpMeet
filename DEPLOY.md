# Deploy to Railway - 3 STEPS (2 minutes)

## 🚀 FASTEST Deployment Ever

### Step 1: Commit & Push to GitHub (30 seconds)
```bash
git commit -m "TerpMeet app ready for deployment"

# Create a new repo on GitHub at github.com/new
# Then run:
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway (60 seconds)

1. Go to [railway.app](https://railway.app) → Login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your **TerpMeet** repository
4. Click **"Add variables"** → Add:
   - `NODE_ENV` = `production`
5. Click **"+ New"** → **"Database"** → **"Add MongoDB"**
6. Done! Wait ~2-3 minutes for build

### Step 3: Get Your URL (10 seconds)

1. Click on your service
2. Go to **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Your app is live! 🎉

---

## That's it! Your app is deployed.

Railway auto-detects:
- ✅ Node.js project
- ✅ Build command: `npm run build`
- ✅ Start command: `npm start`
- ✅ MongoDB connection (from plugin)

URL: `https://your-app-name.up.railway.app`

---

## Alternative: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

---

## What Happens During Deployment:

1. Railway runs `npm install` in the root
2. Railway runs `npm run build` (builds the frontend)
3. Railway runs `npm start` (starts the server)
4. Server serves the frontend from `/frontend/dist`
5. All API calls go to `/api/*`

## Troubleshooting

If deployment fails:
- Check Railway logs for errors
- Make sure MongoDB plugin is connected
- Verify `MONGODB_URI` is set correctly
- Check that `NODE_ENV=production` is set
