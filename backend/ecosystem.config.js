module.exports = {
  apps: [
    {
      name: "afristock-backend",
      script: "./index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 4000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000
      },
      // Configuration des logs
      error_file: "./logs/pm2/error.log",
      out_file: "./logs/pm2/out.log",
      log_file: "./logs/pm2/combined.log",
      time: true,
      // Redémarrage automatique
      watch: false,
      max_memory_restart: "1G",
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm Z",
      combine_logs: true,
      // Monitoring
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
