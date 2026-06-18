module.exports = {
  apps: [
    {
      name: 'elcar-site',
      cwd: 'home/developer/projects/site',
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
      cwd: 'home/developer/projects/admin',
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
      cwd: 'home/developer/projects/api',
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
