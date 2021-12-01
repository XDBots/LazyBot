import { client, startUserbot } from './userbot';
import { LazyFileHelper, LazyLogger } from './helpers';
import { plugins } from './plugins';
import { prisma } from './prisma';

(async () => {
  await LazyFileHelper.init();
  await startUserbot();
  await plugins.load(client);
  await LazyLogger.log(client, '[LazyBot] => Running...');
})();

process.on('SIGINT', async () => {
  await client.disconnect();
  await prisma.$disconnect();
});
