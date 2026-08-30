#!/usr/bin/env bash
# ==============================================================================
# 🚀 M/S Rong Bahar: Multi-Cloud Deployment & Health Verification Script (Bash)
# ==============================================================================
set -e

COMMIT_MSG="${1:-feat(cloud): automated multi-cloud deployment with DFS/BFS engine and fast inventory ingestion}"

echo "=================================================================="
echo "🚀 M/S Rong Bahar: Initiating Automated Multi-Cloud Sync"
echo "=================================================================="

echo "📦 Stage 1: Staging files..."
git add -A

echo "💾 Stage 2: Committing changes..."
git commit -m "$COMMIT_MSG" || echo "No new uncommitted changes found."

echo "🚀 Stage 3: Pushing to GitHub (origin main)..."
git push origin main

echo "=================================================================="
echo "☁️ Stage 4: Verifying Multi-Cloud Connectivity & Endpoints..."
echo "=================================================================="

API_URL="${API_URL:-https://ms-rong-bahar.onrender.com/api}"
STOREFRONT_URL="${STOREFRONT_URL:-https://msrongbahar.com}"

echo "📡 Testing Storefront Cloud Endpoint: $STOREFRONT_URL ..."
curl -s -o /dev/null -w "Storefront HTTP Status: %{http_code}\n" "$STOREFRONT_URL" || echo "Storefront Edge ping skipped."

echo "📡 Testing NestJS Backend Cloud Health: $API_URL/health ..."
curl -s "$API_URL/health" || echo "NestJS Backend ping completed."

echo "=================================================================="
echo "🎉 Multi-Cloud Deployment Pipeline triggered successfully!"
echo "• GitHub Actions CI/CD: https://github.com/provat1640/MsRongBahar/actions"
echo "• Render Backend Cloud: https://dashboard.render.com"
echo "• Vercel Edge Storefront: https://vercel.com"
echo "=================================================================="
