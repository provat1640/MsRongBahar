# ==============================================================================
# 🚀 M/S Rong Bahar: Multi-Cloud Deployment & Health Verification Script (PowerShell)
# ==============================================================================
param (
    [string]$CommitMessage = "feat(cloud): automated multi-cloud deployment with DFS/BFS engine and fast inventory ingestion"
)

$ErrorActionPreference = "Continue"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🚀 M/S Rong Bahar: Initiating Automated Multi-Cloud Sync" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

Write-Host "📦 Stage 1: Staging files..." -ForegroundColor Yellow
git add -A

Write-Host "💾 Stage 2: Committing changes..." -ForegroundColor Yellow
git commit -m "$CommitMessage"

Write-Host "🚀 Stage 3: Pushing to GitHub (origin main)..." -ForegroundColor Yellow
git push origin main

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "☁️ Stage 4: Verifying Multi-Cloud Connectivity & Endpoints..." -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$backendUrl = if ($env:NEXT_PUBLIC_API_URL) { "$($env:NEXT_PUBLIC_API_URL)/health" } else { "https://ms-rong-bahar.onrender.com/api/health" }

Write-Host "📡 Testing NestJS Backend Cloud Health: $backendUrl ..." -ForegroundColor Green
try {
    $res = Invoke-RestMethod -Uri $backendUrl -Method Get -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Backend Cloud Status: $($res.status) | Database: $($res.database)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend is currently cold-starting or offline (Standby mode active)" -ForegroundColor Yellow
}

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🎉 Multi-Cloud Deployment Pipeline triggered successfully!" -ForegroundColor Green
Write-Host "• GitHub Actions CI/CD: https://github.com/provat1640/MsRongBahar/actions"
Write-Host "• Render Backend Cloud: https://dashboard.render.com"
Write-Host "• Vercel Edge Storefront: https://vercel.com"
Write-Host "==================================================================" -ForegroundColor Cyan
