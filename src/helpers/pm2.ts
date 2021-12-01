import pm2 from 'pm2';
import { prisma } from '../prisma';
import { client } from '../userbot';
class PM2Helper {
  constructor() {}

  async cleanup() {
    await prisma.$disconnect();
    await client.disconnect();
  }

  restart() {
    pm2.connect(async (err) => {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      await this.cleanup();

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