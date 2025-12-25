# 🚀 Deployment Guide - महाराष्ट्र बैलगाडा शर्यत बाजार

Complete step-by-step guide to deploy your website to production.

## 📋 Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] Database is set up (Supabase)
- [ ] Environment variables are ready
- [ ] Domain name is ready (optional)

---

## 🎯 Option 1: Deploy to Vercel (Recommended - Easiest)

### Step 1: Push Code to GitHub

1. **Initialize Git** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Bull Marketplace"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it: `bull-marketplace` (or any name)
   - Make it **Public** or **Private**
   - Click "Create repository"

3. **Push Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bull-marketplace.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-generated-secret-key
   ```

   **Important:**
   - Replace `YOUR_PASSWORD` with your Supabase password (URL-encoded if needed)
   - Replace `xxxxx` with your Supabase project ID
   - For `NEXTAUTH_URL`, use your Vercel URL first, then update after deployment
   - Generate `NEXTAUTH_SECRET`:
     ```bash
     openssl rand -base64 32
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

6. **Set Up Custom Domain** (if you have one):
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS instructions
   - Update `NEXTAUTH_URL` to your custom domain

### Step 3: Post-Deployment

1. **Update Environment Variables**:
   - If you added a custom domain, update `NEXTAUTH_URL` in Vercel
   - Redeploy if needed

2. **Test Your Site**:
   - Visit your Vercel URL
   - Test signup/login
   - Test adding a bull
   - Test viewing bulls

---

## 🎯 Option 2: Deploy to Render

### Step 1: Push Code to GitHub

Same as Vercel Step 1 above.

### Step 2: Create PostgreSQL Database on Render

1. **Go to Render**:
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `bull-marketplace-db`
   - Plan: **Free** (or paid)
   - Region: Choose closest
   - Click "Create Database"
   - **Save the Internal Database URL** (you'll need it)

### Step 3: Create Web Service

1. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Click "Connect"

2. **Configure Service**:
   - **Name**: `bull-marketplace`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: 
     ```
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```
     npm start
     ```

3. **Add Environment Variables**:
   Click "Environment" and add:

   ```
   DATABASE_URL=<Internal Database URL from Step 2>
   NEXTAUTH_URL=https://your-app.onrender.com
   NEXTAUTH_SECRET=your-generated-secret-key
   ```

   **Important:**
   - Use the **Internal Database URL** from Render (not external)
   - Generate `NEXTAUTH_SECRET`:
     ```bash
     openssl rand -base64 32
     ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment

5. **Set Up Custom Domain** (if you have one):
   - Go to Settings → Custom Domains
   - Add your domain
   - Follow DNS instructions
   - Update `NEXTAUTH_URL` to your custom domain

---

## 🔧 Environment Variables Reference

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@host:5432/db?schema=public` |
| `NEXTAUTH_URL` | Your website URL | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generated random string |

### Generate NEXTAUTH_SECRET:

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

---

## 🌐 Custom Domain Setup

### For Vercel:

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed:
   - Add A record pointing to Vercel IP
   - Or add CNAME record
4. Wait for DNS propagation (5-30 minutes)
5. Update `NEXTAUTH_URL` environment variable

### For Render:

1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records:
   - Add CNAME record pointing to your Render service
4. Wait for DNS propagation
5. Update `NEXTAUTH_URL` environment variable

---

## ✅ Post-Deployment Checklist

- [ ] Website is accessible
- [ ] Can sign up new users
- [ ] Can log in
- [ ] Can add new bulls
- [ ] Images display correctly
- [ ] Database connection works
- [ ] Custom domain works (if added)
- [ ] HTTPS is enabled (automatic on Vercel/Render)

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Make sure all dependencies are in `package.json`
- Check `node_modules` is in `.gitignore`

**Error: "Prisma Client not generated"**
- Add `npx prisma generate` to build command
- For Render: `npm install && npx prisma generate && npm run build`

### Database Connection Issues

**Error: "Can't reach database server"**
- Check `DATABASE_URL` is correct
- For Render: Use Internal Database URL
- For Vercel: Use Supabase connection string
- Make sure password is URL-encoded if it has special characters

### Authentication Issues

**Error: "Invalid credentials"**
- Check `NEXTAUTH_URL` matches your actual domain
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### Images Not Displaying

**Base64 images too large:**
- For production, integrate cloud storage (Cloudinary, AWS S3)
- Or use image URLs instead of file uploads

---

## 📝 Quick Deploy Commands

### Vercel CLI (Alternative Method):

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
```

### Render CLI (Alternative Method):

```bash
# Install Render CLI
npm i -g render-cli

# Login
render login

# Deploy (follow prompts)
render deploy
```

---

## 🎉 Success!

Once deployed, your website will be live at:
- **Vercel**: `https://your-app.vercel.app`
- **Render**: `https://your-app.onrender.com`
- **Custom Domain**: `https://your-domain.com`

Share your website and start selling bulls! 🐂

---

## 📞 Need Help?

- Check the main `README.md` for more details
- Review `SUPABASE_SETUP.md` for database setup
- Check deployment platform documentation

