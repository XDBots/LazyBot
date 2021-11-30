import { client, startUserbot } from './userbot';
import { LazyFileHelper } from './helpers';
import { plugins } from './plugins';

(async () => {
  await LazyFileHelper.init();
  await startUserbot();
  await plugins.load(client);
})();
