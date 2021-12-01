import { LazyPM2 } from '../helpers';

const RESTART: LBPlugin = {
  handler: async (event) => {
    await event.message.edit({ text: 'Restarting LazyBot' });
    LazyPM2.restart();
  },
  commands: 'restart',
  outgoing: true
};

const RELOAD: LBPlugin = {
  handler: async (event) => {
    await event.message.edit({ text: 'Reloading LazyBot' });
    LazyPM2.reload();
  },
  commands: 'reload',
  outgoing: true
};

const LOGS: LBPlugin = {
  handler: async (event) => {
    await event.message.edit({
      text: (await LazyPM2.getLogs()) || 'Failed to get Logs'
    });
  },
  commands: 'logs',
  outgoing: true
};

export default [RESTART, RELOAD, LOGS];
export const help =
  '<i>Core plugin to manage LazyBot</i>\n\n' +
  '<b>Available Commands : </b>\n\n' +
  '• <code>{}restart</code> : Restart LazyBot\n\n' +
  '• <code>{}reload</code> : Reload LazyBot\n\n' +
  '• <code>{}logs</code> : Get PM2 Logs\n\n';
