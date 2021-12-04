import dotenv from 'dotenv';
import { cleanEnv, str, num } from 'envalid';
dotenv.config({});

export default cleanEnv(process.env, {
  API_ID: num(),
  API_HASH: str(),
  STRING_SESSION: str(),
  CONNECTION_RETRIES: num({
    default: 5
  }),
  LOG_LEVEL: str({
    choices: ['none', 'debug', 'error'],
    default: 'none'
  }),
  CMD_PREFIX: str({ default: '.' }),
  DATABASE_URL: str(),
  LOG_CHAT_ID: num(),
  PM_PERMIT_MODE: str({ choices: ['text', 'media'], default: 'text' }),
  PM_PERMIT_MEDIA: str({
    default: 'https://telegra.ph/file/830d75f72e02ca97f7242.jpg'
  }),
  PM_PERMIT_MAX_WARNS: num({ default: 3 })
});
