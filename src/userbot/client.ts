import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Logger } from 'telegram/extensions';
import env from '../env';

Logger.setLevel(env.LOG_LEVEL);

export const client = new TelegramClient(
  new StringSession(env.STRING_SESSION),
  env.API_ID,
  env.API_HASH,
  {
    connectionRetries: env.CONNECTION_RETRIES
  }
);

export const startUserbot = async () => {
  client.setParseMode('html');
  try {
    await client.start({ botAuthToken: '' });
  } catch (e) {
    console.log('[LazyBot] => Invalid Session String');
    process.exit(1);
  }
};
