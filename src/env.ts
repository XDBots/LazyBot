import dotenv from 'dotenv';
import { cleanEnv, str, num } from 'envalid';
dotenv.config({});

export default cleanEnv(process.env, {
  API_ID: num({
    desc: "Your telegram app's API_ID. Get it from https://my.telegram.org/apps"
  }),
  API_HASH: str({
    desc: "Your telegram app's API_ID. Get it from https://my.telegram.org/apps"
  }),
  STRING_SESSION: str({
    desc: 'GramJS/Telethon session string of the VC User.'
  }),
  CONNECTION_RETRIES: num({
    default: 5,
    desc: 'GramJS maximum connection retries limit'
  }),
  LOG_LEVEL: str({
    choices: ['none', 'debug', 'error'],
    default: 'none',
    desc: 'GramJS Log Level'
  }),
  CMD_PREFIX: str({ default: '.', desc: 'Userbot Command Prefix' }),
  DATABASE_URL: str({ desc: 'Postgres database connection string' }),

  PM_PERMIT_MODE: str({ choices: ['text', 'media'], default: 'text' }),
  PM_PERMIT_MEDIA: str({
    default: 'https://telegra.ph/file/830d75f72e02ca97f7242.jpg'
  }),
  PM_PERMIT_MAX_WARNS: num({ default: 3 })
});
