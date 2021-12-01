import { LazyPM2 } from '../helpers';

const RESTART: LBPlugin = {
  handler: async (event) => {
    await event.message.edit({ text: 'Restarting LazyBot' });
    LazyPM2.restart();
  },
  commands: 'restart',
  outgoing: true
};

export default [RESTART];
export const help =
  '<i>Core plugin to manage LazyBot</i>\n\n' +
  '<b>Available Commands : </b>\n\n' +
  '• <code>{}restart</code> : Restart LazyBot';
