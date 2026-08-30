# ==========================================
# 🚀 M/S Rong Bahar: Cloud Deployment Sync Script (PowerShell)
# ==========================================
param (
    [string]$CommitMessage = "feat(cloud): automated multi-cloud deployment update"
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 M/S Rong Bahar: Initiating Automated Cloud Sync" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Check Git Status
Write-Host "📦 Stage 1: Checking modified and new files..." -ForegroundColor Gray
git status -s

# 2. Stage all files
Write-Host "✨ Stage 2: Staging codebase changes..." -ForegroundColor Gray
git add -A

# 3. Commit changes
Write-Host "💾 Stage 3: Committing with message: '$CommitMessage'..." -ForegroundColor Gray
git commit -m "$CommitMessage"

# 4. Push to origin main
Write-Host "🚀 Stage 4: Pushing to GitHub (origin main)..." -ForegroundColor Cyan
git push origin main

Write-Host "========================================================" -ForegroundColor Green
Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "GitHub Actions Multi-Cloud CI/CD is now automatically building & deploying to:" -ForegroundColor White
Write-Host "  • 🌐 Vercel Edge Network (Next.js Storefront)" -ForegroundColor Yellow
Write-Host "  • 🚀 Render / Fly.io (NestJS Core API)" -ForegroundColor Yellow
Write-Host "  • 🐳 GitHub Container Registry (GHCR Multi-Stage Docker Images)" -ForegroundColor Yellow
Write-Host "  • 🐘 PostgreSQL Database (Prisma Migrations)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
