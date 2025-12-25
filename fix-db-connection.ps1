# Fix Database Connection Script
# Run this script to fix Prisma connection issues

Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "Clearing Prisma cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue

Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`n✅ Done! Now restart your dev server with: npm run dev" -ForegroundColor Green

