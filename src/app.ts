import { client, startUserbot, plugins } from './userbot';

(async () => {
  await startUserbot();
  await plugins.load(client);
})();
