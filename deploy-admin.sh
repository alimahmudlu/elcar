#!/bin/bash
set -e

# Configuration
BRANCH=$1
DIRECTORY=$2
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"  # Replace with your repo
APP_NAME="elcar-admin"
LOG_FILE="/home/ubuntu/www/elcar/deployment-admin.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "🚀 Starting Admin deployment from $BRANCH"

# Change to admin directory
cd $DIRECTORY

# Create backup
log "📦 Creating backup..."
if [ -d "backup" ]; then rm -rf backup; fi
mkdir backup
cp -r node_modules backup/ 2>/dev/null || true
cp package.json backup/ 2>/dev/null || true

# Pull latest code from admin branch
log "📥 Pulling latest code from $BRANCH..."
git fetch origin
git reset --hard origin/admin

# Install dependencies
log "📋 Installing dependencies..."
npm ci

# Build application
log "🏗️ Building application..."
npm run build

# Set PORT environment variable
export PORT=3112

# Restart PM2 process
log "🔄 Restarting application..."
sudo -u ubuntu pm2 restart $APP_NAME || sudo -u ubuntu pm2 start npm --name $APP_NAME -- start

log "✅ Admin deployment completed successfully!"
