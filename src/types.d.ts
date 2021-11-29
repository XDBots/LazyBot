import {
  NewMessageInterface,
  NewMessageEvent
} from 'telegram/events/NewMessage';
import { TelegramClient } from 'telegram';

declare global {
  interface LGPlugin extends NewMessageInterface {
    handler: (event: NewMessageEvent, client: TelegramClient) => Promise<void>;
    commands?: string | string[];
    allowArgs?: boolean;
  }

  type LGHelp = (prefix: string) => string;
}
