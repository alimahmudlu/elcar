const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.WEBHOOK_SECRET;

app.use(express.json());

// Simple logging function
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Branch to deployment mapping
const DEPLOYMENT_CONFIG = {
    'refs/heads/frontend': {
        name: 'Frontend (Site)',
        script: '/home/ubuntu/www/elcar/deploy-site.sh',
        directory: '/home/ubuntu/www/elcar/site'
    },
    'refs/heads/backend': {
        name: 'Backend (API)', 
        script: '/home/ubuntu/www/elcar/deploy-api.sh',
        directory: '/home/ubuntu/www/elcar/api'
    },
    'refs/heads/admin': {
        name: 'Admin Panel',
        script: '/home/ubuntu/www/elcar/deploy-admin.sh', 
        directory: '/home/ubuntu/www/elcar/admin'
    }
};

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    
    if (!signature) {
        log('❌ No signature provided');
        return res.status(401).send('No signature provided');
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = `sha256=${crypto
        .createHmac('sha256', SECRET)
        .update(payload)
        .digest('hex')}`;

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        log('❌ Invalid signature');
        return res.status(401).send('Invalid signature');
    }

    const branch = req.body.ref;
    const config = DEPLOYMENT_CONFIG[branch];

    if (!config) {
        log(`ℹ️ Ignoring push to ${branch} - not configured for deployment`);
        return res.json({ message: `Branch ${branch} not configured for deployment` });
    }

    log(`🚀 Deploying ${config.name} from ${branch}...`);
    
    // Execute deployment script with branch and directory info
    const deployCommand = `bash ${config.script} ${branch} ${config.directory}`;
    
    exec(deployCommand, (error, stdout, stderr) => {
        if (error) {
            log(`❌ ${config.name} deployment failed: ${error}`);
            return res.status(500).json({ error: `${config.name} deployment failed` });
        }
        
        log(`✅ ${config.name} deployment successful`);
        if (stdout) log(`Output: ${stdout}`);
        if (stderr) log(`Warnings: ${stderr}`);
    });

    res.json({ 
        message: `${config.name} deployment started`,
        branch: branch,
        directory: config.directory
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        configured_branches: Object.keys(DEPLOYMENT_CONFIG)
    });
});

// Health check for nginx proxy
app.get('/ci-webhook-health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'webhook-listener',
        timestamp: new Date().toISOString(),
        port: PORT,
        configured_branches: Object.keys(DEPLOYMENT_CONFIG)
    });
});

app.listen(PORT, () => {
    log(`🎣 Webhook listener started on port ${PORT}`);
    log(`🔑 Using secret: ${SECRET ? 'SET' : 'NOT SET'}`);
    log(`📋 Configured branches: ${Object.keys(DEPLOYMENT_CONFIG).join(', ')}`);
});
