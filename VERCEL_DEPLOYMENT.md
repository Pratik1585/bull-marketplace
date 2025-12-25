# 🚀 Vercel Deployment with Custom Domain

Step-by-step guide to deploy your Bull Marketplace to Vercel with your custom domain.

## 📋 Prerequisites

- ✅ Code is working locally
- ✅ Supabase database is set up
- ✅ You have a domain name
- ✅ GitHub account

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git (if not done)

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - Bull Marketplace ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `bull-marketplace` (or any name you prefer)
4. Description: "Maharashtra Bailgada Sharyat Bull Marketplace"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.3 Push Code to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/bull-marketplace.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find and click **"Import"** next to `bull-marketplace`
4. Vercel will auto-detect Next.js settings

### 2.3 Configure Project Settings

**Framework Preset:** Next.js (auto-detected) ✅  
**Root Directory:** `./` (leave as is) ✅  
**Build Command:** `npm run build` (auto-filled) ✅  
**Output Directory:** `.next` (auto-filled) ✅  
**Install Command:** `npm install` (auto-filled) ✅

**Click "Environment Variables" to add:**

### 2.4 Add Environment Variables

Click **"Environment Variables"** and add these 3 variables:

#### Variable 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Your Supabase connection string
  ```
  postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public
  ```
  - Replace `YOUR_PASSWORD` with your Supabase password (URL-encode `#` as `%23` if needed)
  - Replace `xxxxx` with your Supabase project ID

#### Variable 2: NEXTAUTH_URL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://your-domain.com` (use your actual domain)
  - Example: `https://bullmarketplace.com`
  - **Important:** Use your custom domain here, not Vercel's default URL

#### Variable 3: NEXTAUTH_SECRET
- **Key:** `NEXTAUTH_SECRET`
- **Value:** Generate a random secret:
  
  **Windows PowerShell:**
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
  
  **Mac/Linux:**
  ```bash
  openssl rand -base64 32
  ```
  
  Copy the output and paste as the value.

**After adding all 3 variables, click "Deploy"**

### 2.5 Wait for Deployment

- Build will take 2-5 minutes
- You'll see build logs in real-time
- Wait for "Ready" status

---

## Step 3: Set Up Custom Domain

### 3.1 Add Domain to Vercel

1. Go to your project dashboard on Vercel
2. Click **"Settings"** tab
3. Click **"Domains"** in the left sidebar
4. Enter your domain name (e.g., `bullmarketplace.com`)
5. Click **"Add"**

### 3.2 Configure DNS Records

Vercel will show you DNS configuration. You need to add these records to your domain provider (GoDaddy, Namecheap, etc.):

#### Option A: Root Domain (bullmarketplace.com)

**If you want to use the root domain:**

Add an **A Record**:
- **Type:** A
- **Name:** `@` or leave blank
- **Value:** Vercel's IP address (shown in Vercel dashboard)
- **TTL:** 3600 (or default)

**OR** Add a **CNAME Record** (if supported):
- **Type:** CNAME
- **Name:** `@` or leave blank
- **Value:** `cname.vercel-dns.com`
- **TTL:** 3600

#### Option B: Subdomain (www.bullmarketplace.com)

**If you want to use www subdomain:**

Add a **CNAME Record**:
- **Type:** CNAME
- **Name:** `www`
- **Value:** `cname.vercel-dns.com`
- **TTL:** 3600

### 3.3 Update DNS at Your Domain Provider

**Common Domain Providers:**

#### GoDaddy:
1. Login to GoDaddy
2. Go to "My Products" → "DNS"
3. Click "Add" to add new record
4. Enter the values from Vercel
5. Save

#### Namecheap:
1. Login to Namecheap
2. Go to "Domain List" → Click "Manage"
3. Go to "Advanced DNS" tab
4. Add new record
5. Enter the values from Vercel
6. Save

#### Cloudflare:
1. Login to Cloudflare
2. Select your domain
3. Go to "DNS" → "Records"
4. Add new record
5. Enter the values from Vercel
6. Save

### 3.4 Wait for DNS Propagation

- DNS changes take 5 minutes to 48 hours
- Usually takes 10-30 minutes
- Vercel will show "Valid Configuration" when ready

### 3.5 Update Environment Variable

Once DNS is configured:
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to your custom domain:
   ```
   https://your-domain.com
   ```
3. Click "Save"
4. Vercel will automatically redeploy

---

## Step 4: Verify Deployment

### 4.1 Test Your Website

1. Visit your custom domain: `https://your-domain.com`
2. You should see your Bull Marketplace homepage
3. Test these features:
   - ✅ Homepage loads
   - ✅ Sign up new account
   - ✅ Login
   - ✅ Add new bull
   - ✅ View bulls
   - ✅ Images display

### 4.2 Check SSL Certificate

- Vercel automatically provides SSL (HTTPS)
- Your site should show 🔒 lock icon
- If not, wait a few minutes for SSL to provision

---

## Step 5: Post-Deployment Checklist

- [ ] Website is accessible at your custom domain
- [ ] HTTPS is working (🔒 lock icon)
- [ ] Can create new user accounts
- [ ] Can login
- [ ] Can add new bulls
- [ ] Images upload and display correctly
- [ ] Database connection works
- [ ] All pages load correctly

---

## 🔧 Troubleshooting

### Domain Not Working

**Issue:** Domain shows "Invalid Configuration"
- **Solution:** Check DNS records are correct
- **Solution:** Wait for DNS propagation (can take up to 48 hours)
- **Solution:** Make sure you added the correct record type

**Issue:** SSL Certificate Not Ready
- **Solution:** Wait 5-10 minutes after DNS is configured
- **Solution:** Vercel automatically provisions SSL

### Build Fails

**Issue:** "Cannot find module"
- **Solution:** Make sure all dependencies are in `package.json`
- **Solution:** Check `node_modules` is in `.gitignore`

**Issue:** "Prisma Client not generated"
- **Solution:** Vercel auto-runs `prisma generate` during build
- **Solution:** If it fails, check `DATABASE_URL` is correct

### Database Connection Issues

**Issue:** "Can't reach database server"
- **Solution:** Check `DATABASE_URL` is correct
- **Solution:** Make sure password is URL-encoded
- **Solution:** Verify Supabase database is active (not paused)

### Authentication Issues

**Issue:** Login doesn't work
- **Solution:** Check `NEXTAUTH_URL` matches your domain exactly
- **Solution:** Verify `NEXTAUTH_SECRET` is set
- **Solution:** Clear browser cookies and try again

---

## 📝 Quick Reference

### Your Vercel Dashboard:
- **URL:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Project Settings:** Settings tab
- **Environment Variables:** Settings → Environment Variables
- **Domains:** Settings → Domains
- **Deployments:** Deployments tab

### Important URLs:
- **Your Website:** `https://your-domain.com`
- **Vercel Dashboard:** `https://vercel.com/dashboard`
- **GitHub Repository:** `https://github.com/YOUR_USERNAME/bull-marketplace`

---

## 🎉 Success!

Your Bull Marketplace is now live at:
**https://your-domain.com**

Share it with your users and start selling bulls! 🐂

---

## 📞 Need Help?

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check domain setup: [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- Vercel Support: Available in dashboard

