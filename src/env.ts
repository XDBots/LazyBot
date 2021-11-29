import dotenv from 'dotenv';
import { cleanEnv, str, num } from 'envalid';
dotenv.config({});

export default cleanEnv(process.env, {
  // Telegram APP API ID
  API_ID: num(),

  // Telegram APP API Hash
  API_HASH: str(),

  // GramJS Session ; https://sg.rojser.best
  STRING_SESSION: str(),

  // GramJS Maximum Connection Retries Limit
  CONNECTION_RETRIES: num({ default: 5 }),

  // GramJS Log Level
  LOG_LEVEL: str({ choices: ['none', 'debug', 'error'], default: 'none' }),

  // Userbot Command Prefix
  CMD_PREFIX: str({ default: '.' }),

  // Postgres DB Connectrion URI
  POSTGRES_URI: str(),

  PM_PERMIT_MODE: str({ choices: ['text', 'media'], default: 'text' }),
  // Media to Use in PM Permit
  PM_PERMIT_MEDIA: str({
    default: 'https://telegra.ph/file/830d75f72e02ca97f7242.jpg'
  }),

  PM_PERMIT_MAX_WARNS: num({ default: 3 })
});
