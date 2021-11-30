import { LazyHelp } from '../userbot';
import { extract, LazyInfoHelper } from '../helpers';

const HELP: LGPlugin = {
  handler: async (event) => {
    const { args } = extract(event.message.message);
    if (!args) {
      await event.message.edit({
        text:
          LazyInfoHelper.getInfo() +
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

export default [HELP];
export const help: LGHelp = (pre) =>
  `<code>${pre}help</code> : Shows this help menu`;
