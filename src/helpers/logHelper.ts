import { TelegramClient } from 'telegram';
import { EntityLike } from 'telegram/define';
import env from '../env';

class LogHelper {
  private log_chat: EntityLike;
  constructor(log_chat_id: EntityLike) {
    this.log_chat = log_chat_id;
  }

  async logError(error: string, client: TelegramClient) {}
}
