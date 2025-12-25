# 🔧 Troubleshooting Guide

## Database Connection Errors

### Error: "Can't reach database server at `postgres:5432`"

This error means your `DATABASE_URL` is not set correctly or is using a default/placeholder value.

#### Solution Steps:

1. **Check if `.env` file exists:**
   ```bash
   # Windows (PowerShell)
   Test-Path .env
   
   # Mac/Linux
   ls -la .env
   ```

2. **Verify your `.env` file contents:**
   Your `.env` file should look like this (with YOUR actual values):
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret-key"
   ```

3. **Common mistakes to check:**
   - ❌ Missing quotes around the connection string
   - ❌ Using `postgres:5432` instead of your Supabase URL
   - ❌ Forgot to replace `[YOUR-PASSWORD]` with actual password
   - ❌ Missing `?schema=public` at the end
   - ❌ File named `.env.txt` instead of `.env`
   - ❌ `.env` file in wrong directory (should be in root, same as `package.json`)

4. **Get correct Supabase connection string:**
   - Go to your Supabase project dashboard
   - Settings → Database → Connection string
   - Click **URI** tab (not Connection pooling)
   - Copy the full string
   - Replace `[YOUR-PASSWORD]` with your actual database password

5. **Restart your development server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Error: "Environment variable not found: DATABASE_URL"

#### Solution:
1. Make sure `.env` file exists in the root directory
2. Restart your development server (environment variables load on startup)
3. Check file name is exactly `.env` (not `.env.local` or `.env.txt`)

### Error: "Invalid connection string format"

#### Solution:
Your connection string should follow this format:
```
postgresql://postgres:PASSWORD@HOST:5432/postgres?schema=public
```

Make sure:
- It starts with `postgresql://`
- Includes your password (no brackets)
- Includes `?schema=public` at the end
- Is wrapped in quotes: `"..."`

### Error: "Connection refused" or "Connection timeout"

#### Possible causes:
1. **Supabase project is paused** (free tier pauses after inactivity)
   - Go to Supabase dashboard
   - Click "Restore" to reactivate

2. **Wrong password**
   - Double-check your database password
   - Try resetting password in Supabase Settings → Database

3. **Network/firewall issues**
   - Check your internet connection
   - Try from a different network

4. **Wrong connection string**
   - Make sure you're using the URI from Supabase (not connection pooling)
   - Verify the host is correct

### Verify Your Setup

Run this command to test your database connection:
```bash
npx prisma db pull
```

If successful, you'll see your database schema. If it fails, check the error message.

### Quick Fix Checklist

- [ ] `.env` file exists in root directory (same folder as `package.json`)
- [ ] `.env` file contains `DATABASE_URL` with correct Supabase connection string
- [ ] Password in connection string matches your Supabase database password
- [ ] Connection string includes `?schema=public` at the end
- [ ] Restarted development server after creating/editing `.env`
- [ ] Supabase project is active (not paused)
- [ ] No typos in the connection string

### Still Not Working?

1. **Create a fresh `.env` file:**
   ```bash
   # Delete old .env if exists
   # Windows
   Remove-Item .env -ErrorAction SilentlyContinue
   
   # Mac/Linux
   rm .env
   
   # Create new one
   # Windows
   New-Item -Path .env -ItemType File
   
   # Mac/Linux
   touch .env
   ```

2. **Copy this template and fill in YOUR values:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@db.xxxxx.supabase.co:5432/postgres?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="paste-your-generated-secret-here"
   ```

3. **Verify Prisma can connect:**
   ```bash
   npx prisma db pull
   ```

4. **If Prisma works, restart Next.js:**
   ```bash
   npm run dev
   ```

### Example Correct `.env` File

```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890AbCdEf=="
```

**Important:** 
- Replace `MySecurePassword123` with YOUR actual Supabase database password
- Replace `abcdefghijklmnop` with YOUR actual Supabase project ID
- Generate a new `NEXTAUTH_SECRET` using the commands in SUPABASE_SETUP.md

