import { client, startUserbot } from './userbot';
import { LazyFileHelper, LazyLogger } from './helpers';
import { plugins } from './plugins';

(async () => {
  await LazyFileHelper.init();
  await startUserbot();
  await plugins.load(client);
  await LazyLogger.log(client, '[LazyBot] => Running...');
})();
