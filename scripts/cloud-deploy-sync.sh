#!/usr/bin/env bash
# ==========================================
# 🚀 M/S Rong Bahar: Cloud Deployment Sync Script (Bash)
# ==========================================
set -e

COMMIT_MSG="${1:-feat(cloud): automated multi-cloud deployment update}"

echo "========================================================"
echo "🚀 M/S Rong Bahar: Initiating Automated Cloud Sync"
echo "========================================================"

echo "📦 Stage 1: Staging files..."
git add -A

echo "💾 Stage 2: Committing changes..."
git commit -m "$COMMIT_MSG" || echo "No changes to commit"

echo "🚀 Stage 3: Pushing to GitHub (origin main)..."
git push origin main

echo "========================================================"
echo "🎉 Successfully pushed to GitHub!"
echo "Multi-Cloud Auto-Deployment pipeline is running in GitHub Actions."
echo "========================================================"
