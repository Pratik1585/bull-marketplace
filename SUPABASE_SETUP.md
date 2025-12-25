# 🗄️ Supabase Setup Guide

Complete step-by-step guide to set up your Bull Marketplace with Supabase PostgreSQL database.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, click **"New Project"** (green button)
2. Fill in the project details:
   - **Name**: `bull-marketplace` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Select **Free** tier
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

## Step 3: Get Your Database Connection String

1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **Database** in the settings menu
3. Scroll down to **Connection string** section
4. Click on **URI** tab
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Important**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 2

   Example:
   ```
   postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```

## Step 4: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

## Step 5: Create Environment File

1. Create a `.env` file in the root directory of your project:

   **Windows (PowerShell):**
   ```powershell
   New-Item -Path .env -ItemType File
   ```

   **Mac/Linux:**
   ```bash
   touch .env
   ```

2. Open the `.env` file and add these variables:

   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

3. **Replace the values:**
   - `DATABASE_URL`: Paste your Supabase connection string from Step 3
   - `NEXTAUTH_SECRET`: Generate a random secret key (see below)

### Generate NEXTAUTH_SECRET

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

**Your final `.env` file should look like:**
```env
DATABASE_URL="postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890=="
```

## Step 6: Set Up Database Schema

Run these commands to create the database tables:

```bash
npx prisma generate
npx prisma db push
```

You should see output like:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema.
```

## Step 7: Verify Database Setup (Optional)

You can verify the tables were created:

1. Go back to your Supabase dashboard
2. Click on **Table Editor** in the left sidebar
3. You should see two tables:
   - `User` - for user accounts
   - `Bull` - for bull listings

## Step 8: Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

## Step 9: Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Bull Marketplace homepage! 🎉

## Step 10: Create Your First Account

1. Click **"Sign Up"** in the navigation bar
2. Fill in:
   - Name
   - Email
   - Password (at least 6 characters)
   - Confirm Password
3. Click **"Sign Up"**
4. You'll be redirected to sign in
5. Sign in with your credentials

## Step 11: List Your First Bull

1. After signing in, click **"List Bull"** in the navigation
2. Fill in the form:
   - **Required fields**: Name, Breed, Age, Weight, Price
   - **Optional fields**: Location, Description, Contact Info, Images, Health Info, Pedigree, Vaccination
3. Click **"Create Listing"**
4. Your bull will appear on the homepage!

## Troubleshooting

### "Connection refused" or "Connection timeout"
- Check your `DATABASE_URL` is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Verify your Supabase project is active (not paused)

### "Invalid connection string"
- Make sure the connection string includes `?schema=public` at the end
- Check for any extra spaces or quotes

### "Table already exists" error
- This is normal if you run `prisma db push` multiple times
- You can ignore it or reset your database in Supabase dashboard

### Supabase project paused
- Free tier projects pause after 1 week of inactivity
- Go to Supabase dashboard and click "Restore" to reactivate

### Can't find connection string
- Go to: Settings → Database → Connection string → URI tab
- Make sure you're copying the full string including password

## Next Steps

Once everything is working locally:
1. Test all features (sign up, sign in, add bulls, view listings)
2. Check the main `README.md` for deployment instructions
3. When deploying, update `NEXTAUTH_URL` to your production domain

## Supabase Dashboard Features

While developing, you can use Supabase features:
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom SQL queries
- **API**: Access REST API (if needed later)
- **Authentication**: Supabase Auth (we're using NextAuth, but Supabase Auth is available)

## Security Notes

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Keep your database password secure
- For production, use environment variables in your hosting platform (Vercel/Render)

---

**Need help?** Check the main `README.md` or `QUICKSTART.md` for more information.

