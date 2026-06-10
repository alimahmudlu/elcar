#!/bin/bash
set -e

# Configuration
BRANCH=$1
DIRECTORY=$2
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"  # Replace with your repo
APP_NAME="elcar-api"
LOG_FILE="/home/ubuntu/www/elcar/deployment-api.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "🚀 Starting API deployment from $BRANCH"

# Change to API directory
cd $DIRECTORY

# Create backup
log "📦 Creating backup..."
if [ -d "backup" ]; then rm -rf backup; fi
mkdir backup
cp -r node_modules backup/ 2>/dev/null || true
cp package.json backup/ 2>/dev/null || true

# Pull latest code from backend branch
log "📥 Pulling latest code from $BRANCH..."
git fetch origin
git reset --hard origin/backend

# Install dependencies
log "📋 Installing dependencies..."
npm ci

# Build if needed
log "🏗️ Building application..."
npm run build 2>/dev/null || echo "No build script found"

# Set PORT environment variable
export PORT=3115

# Restart PM2 process
log "🔄 Restarting application..."
sudo -u ubuntu pm2 restart $APP_NAME || sudo -u ubuntu pm2 start npm --name $APP_NAME -- start

log "✅ API deployment completed successfully!"
