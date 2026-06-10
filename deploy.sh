#!/bin/bash
set -e

PROJECT_NAME="elcar-site"
SITE_PATH="/home/ubuntu/www/elcar/site"
BACKUP_PATH="/var/backups/elcar"
LOG_FILE="/var/log/elcar-deploy.log"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Create backup
log "Creating backup..."
BACKUP_NAME="elcar-backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_PATH
cp -r $SITE_PATH $BACKUP_PATH/$BACKUP_NAME

# Update code
cd /home/ubuntu/www/elcar
log "Pulling latest changes..."
git fetch origin
git reset --hard origin/main

# Install and build
cd $SITE_PATH
log "Installing dependencies..."
npm ci --production

log "Building application..."
npm run build

log "Restarting application..."
pm2 restart $PROJECT_NAME

log "✅ Deployment completed!"
