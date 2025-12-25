# 🚀 Quick Start Guide

Follow these steps to get your Bull Marketplace website running locally.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, NextAuth, and Tailwind CSS.

## Step 2: Set Up Database

You need a PostgreSQL database. Choose one option:

### Option A: Supabase (Recommended - Easiest)
**See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed Supabase setup instructions**

Quick steps:
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Get your connection string from Settings → Database → Connection string → URI
4. Replace `[YOUR-PASSWORD]` with your database password

### Option B: Local PostgreSQL
If you have PostgreSQL installed locally:
```bash
# Create a database
createdb bullmarketplace
```

### Option C: Other Cloud Databases
- [Neon](https://neon.tech) - Free tier available
- [Railway](https://railway.app) - Free tier available

## Step 3: Create Environment File

Create a file named `.env` in the root directory:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Mac/Linux
touch .env
```

Then add these variables to `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bullmarketplace?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Important:**
- Replace `DATABASE_URL` with your actual database connection string
- For `NEXTAUTH_SECRET`, generate a random string:
  ```bash
  # Windows (PowerShell)
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  
  # Mac/Linux
  openssl rand -base64 32
  ```

## Step 4: Set Up Database Schema

```bash
npx prisma generate
npx prisma db push
```

This creates the database tables for users and bulls.

## Step 5: Start Development Server

```bash
npm run dev
```

## Step 6: Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Bull Marketplace homepage!

## Step 7: Create Your First Account

1. Click "Sign Up" in the navigation
2. Fill in your name, email, and password
3. Click "Sign Up"
4. You'll be redirected to sign in
5. Sign in with your credentials

## Step 8: List Your First Bull

1. After signing in, click "List Bull" in the navigation
2. Fill in the bull information:
   - Name, Breed, Age, Weight, Price (required)
   - Add optional details like location, description, health info, etc.
3. Click "Create Listing"
4. Your bull will appear on the homepage and browse page!

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors
- Check your `DATABASE_URL` is correct
- Make sure your database is running (if local)
- For cloud databases, check if connection is allowed from your IP

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Prisma errors
```bash
# Reset Prisma client
npx prisma generate
```

## Next Steps

Once everything is working locally, check the main `README.md` for deployment instructions to Vercel or Render!

