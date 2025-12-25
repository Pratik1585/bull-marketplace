# 🐂 Bull Marketplace

A modern web application for buying and selling bulls. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- ✅ View available bulls for sale
- ✅ Add new bull listings with detailed information
- ✅ User authentication (sign up/sign in)
- ✅ Extended information fields (health, pedigree, vaccination records)
- ✅ Responsive, modern UI
- ✅ Ready for deployment on Vercel or Render

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel / Render

## Quick Start

**For detailed step-by-step instructions, see [QUICKSTART.md](./QUICKSTART.md)**

### Quick Steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bullmarketplace?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   ```

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Getting Started (Detailed)

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bull-selling-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bullmarketplace?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Set Environment Variables** in Vercel:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your domain (e.g., `https://yourdomain.com`)
   - `NEXTAUTH_SECRET` - Generate a random string (you can use: `openssl rand -base64 32`)

4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

5. **Deploy**: Click "Deploy"

6. **Set up Custom Domain**:
   - Go to Project Settings → Domains
   - Add your domain name
   - Follow DNS configuration instructions

### Option 2: Deploy to Render

1. **Push your code to GitHub**

2. **Create a PostgreSQL Database on Render**:
   - Go to [render.com](https://render.com)
   - Create a new PostgreSQL database
   - Copy the Internal Database URL

3. **Create a Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use the following settings:
     - **Environment**: Node
     - **Build Command**: `npm install && npx prisma generate && npm run build`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `DATABASE_URL` - Use the Internal Database URL from step 2
     - `NEXTAUTH_URL` - Your Render service URL (e.g., `https://your-app.onrender.com`)
     - `NEXTAUTH_SECRET` - Generate a random string

4. **Deploy**: Click "Create Web Service"

5. **Set up Custom Domain**:
   - Go to your service settings
   - Add your custom domain
   - Update `NEXTAUTH_URL` to your custom domain

### Database Setup for Production

#### Option A: Supabase (Recommended - Free tier available)
**📖 See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions**

1. Create a project on [supabase.com](https://supabase.com)
2. Get the connection string from Settings → Database → Connection string → URI
3. Replace `[YOUR-PASSWORD]` with your database password
4. Use it as your `DATABASE_URL` in production environment variables

#### Option B: Render PostgreSQL (Free tier available)
1. Create a PostgreSQL database on Render
2. Use the Internal Database URL for `DATABASE_URL`
3. Run migrations: `npx prisma db push` (or set up in build command)

#### Option C: Neon (Free tier available)
1. Create a project on [neon.tech](https://neon.tech)
2. Get the connection string
3. Use it as your `DATABASE_URL`

#### Option D: Railway (Free tier available)
1. Create a PostgreSQL database on [railway.app](https://railway.app)
2. Get the connection string
3. Use it as your `DATABASE_URL`

### Post-Deployment Steps

1. **Run database migrations** (if needed):
   - You can add this to your build command: `npx prisma db push`
   - Or run it manually after first deployment

2. **Update NEXTAUTH_URL**:
   - Make sure `NEXTAUTH_URL` matches your actual domain
   - For Vercel: `https://yourdomain.com`
   - For Render: `https://your-app.onrender.com` or your custom domain

3. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── bulls/            # Bull listing pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── types/                # TypeScript type definitions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma Client

## Features in Detail

### Bull Listing Form
When adding a new bull, you can provide:
- Basic info: Name, Breed, Age, Weight, Price
- Location and Contact Information
- Description
- Image URLs (comma-separated)
- Health Information
- Pedigree Information
- Vaccination Records

### User Authentication
- Secure password hashing with bcrypt
- JWT-based sessions
- Protected routes for adding bulls

## Troubleshooting

### Database Connection Issues
- Ensure your `DATABASE_URL` is correct
- Check if your database allows connections from your deployment platform
- For Render, use the Internal Database URL
- For Vercel, ensure your database allows external connections

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your actual domain
- Ensure `NEXTAUTH_SECRET` is set
- Clear browser cookies if experiencing session issues

### Build Errors
- Make sure all environment variables are set
- Run `npx prisma generate` before building
- Check that your Node.js version is 18+

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

