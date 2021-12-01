module.exports = {
  apps: [
    {
      name: 'LazyBot',
      script: 'build/app.js',
      exec_mode: 'cluster',
      exp_backoff_restart_delay: 5000,
      kill_timeout: 5000,
      wait_ready: true
    }
  ]
};
