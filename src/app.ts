import { client, startUserbot, plugins } from './userbot';
import { LazyFileHelper } from './helpers';

(async () => {
  await LazyFileHelper.init();
  await startUserbot();
  await plugins.load(client);
})();
