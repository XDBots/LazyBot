import { LazyInfoHelper } from '../helpers';

export default {
  handler: async (event) => {
    await event.message.edit({
      text: LazyInfoHelper.getInfo()
    });
  },
  commands: 'alive'
} as LBPlugin;
export const help =
  `A plugin just to check if LazyBot is on\n\n` +
  `<b>Available Commands :</b>\n\n` +
  `• <code>{}alive</code> - Show LazyBot and some system info`;
