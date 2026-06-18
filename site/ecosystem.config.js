module.exports = {
  apps: [
    {
      name: 'site',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/developer/projects/site',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3111
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3111
      },
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
