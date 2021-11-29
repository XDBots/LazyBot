import { LazyHelp } from '../userbot';
import { extract } from '../utils';

const HELP: LGPlugin = {
  handler: async (event) => {
    const { args } = extract(event.message.message);
    if (!args) {
      await event.message.edit({
        text:
          `<b>Usage :</b> <code>.help plugin</code>\n\n` +
          `<b>Available Plugins</b>\n` +
          `<code>` +
          LazyHelp.getHelpList().reduce(
            (prev, current) => prev + ', ' + current
          ) +
          `</code>`
      });
      return;
    }

    await event.message.edit({
      text:
        `<b>Plugin : </b><code>${args}</code>\n\n` +
        LazyHelp.getHelp(args.trim())
    });
  },
  allowArgs: true,
  commands: 'help'
};

export const help = `<code>Shows this help menu</code>`;
export default [HELP];
