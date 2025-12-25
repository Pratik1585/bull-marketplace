# ⚡ Quick Deployment Guide

## Fastest Way: Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/bull-marketplace.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "Add New Project"
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL` = Your Supabase connection string
   - `NEXTAUTH_URL` = `https://your-app.vercel.app` (update after deploy)
   - `NEXTAUTH_SECRET` = Run: `openssl rand -base64 32`
5. Click "Deploy"
6. Done! 🎉

### 3. Add Custom Domain (Optional)
- Settings → Domains → Add your domain
- Update DNS records
- Update `NEXTAUTH_URL` to your domain

---

## Alternative: Render (10 minutes)

### 1. Push to GitHub (same as above)

### 2. Create Database on Render
- New + → PostgreSQL → Create
- Save Internal Database URL

### 3. Create Web Service
- New + → Web Service → Connect GitHub repo
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start`
- Add environment variables (same as Vercel)
- Deploy!

---

## Environment Variables Needed

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
```

---

**That's it! Your website will be live in minutes!** 🚀

For detailed instructions, see `DEPLOYMENT.md`

