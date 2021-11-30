import { TelegramClient } from 'telegram';
import env from '../env';

class Logger {
  constructor() {}

  async log(client: TelegramClient, message: string) {
    if (!message) return;
    try {
      await client.sendMessage(env.LOG_CHAT_ID, { message });
    } catch (e) {
      console.log('[LazyGram][Error] => ' + e);
    }
  }
}

export const LazyLogger = new Logger();
