module.exports = {
  apps: [
    {
      name: 'elcar-site',
      cwd: '/root/projects/site',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3113
      }
    },
    {
      name: 'elcar-admin',
      cwd: '/root/projects/admin',
      script: 'npm', 
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3112  // Changed to match admin nginx config
      }
    },
    {
      name: 'elcar-api',
      cwd: '/root/projects/api',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3115  // Changed to match API nginx config
      }
    }
  ]
};
