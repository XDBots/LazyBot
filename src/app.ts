import { client, startUserbot, plugins } from './userbot';
import { LazyFileHelper } from './utils';

(async () => {
  await LazyFileHelper.init();
  await startUserbot();
  await plugins.load(client);
})();
