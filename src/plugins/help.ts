import { extract, LazyInfoHelper, LazyHelp } from '../helpers';

const HELP: LBPlugin = {
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
export const help =
  '<b>Examples</b>\n\n' +
  '• <code>{}help</code> : <i>Shows this help menu</i>\n' +
  '• <code>{}help plugin name</code> : <i>Shows help for that plugin</i>';
