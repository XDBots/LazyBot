import pm2 from 'pm2';

class PM2Helper {
  constructor() {}

  restart() {
    pm2.connect((err) => {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      pm2.restart('LazyBot', (err) => {
        if (err) {
          console.log('[LazyBot][PM2] =>' + err.message);
        }
        pm2.disconnect();
      });
    });
  }
}

export const LazyPM2 = new PM2Helper();
