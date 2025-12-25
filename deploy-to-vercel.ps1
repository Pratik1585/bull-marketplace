# Vercel Deployment Helper Script
# This script helps you prepare for Vercel deployment

Write-Host "🚀 Vercel Deployment Preparation" -ForegroundColor Cyan
Write-Host ""

# Check if Git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📦 Initializing Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create GitHub Repository:" -ForegroundColor White
Write-Host "   - Go to https://github.com" -ForegroundColor Gray
Write-Host "   - Click 'New repository'" -ForegroundColor Gray
Write-Host "   - Name it: bull-marketplace" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/bull-marketplace.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Ready for deployment'" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   - Sign in with GitHub" -ForegroundColor Gray
Write-Host "   - Import your repository" -ForegroundColor Gray
Write-Host "   - Add environment variables:" -ForegroundColor Gray
Write-Host "     * DATABASE_URL" -ForegroundColor Gray
Write-Host "     * NEXTAUTH_URL (use your custom domain)" -ForegroundColor Gray
Write-Host "     * NEXTAUTH_SECRET" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Generate NEXTAUTH_SECRET:" -ForegroundColor White
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "   $secret" -ForegroundColor Green
Write-Host ""
Write-Host "5. Add Custom Domain:" -ForegroundColor White
Write-Host "   - Go to Vercel Project Settings -> Domains" -ForegroundColor Gray
Write-Host "   - Add your domain" -ForegroundColor Gray
Write-Host "   - Configure DNS records as shown" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see: VERCEL_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
