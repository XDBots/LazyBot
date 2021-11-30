import { Api } from 'telegram';
import { afk, sleep, extract } from '../helpers';

const AFK_HANDLE: LGPlugin = {
  handler: async (event, client) => {
    if (!afk.isAfk) return;

    if (event.isPrivate && event.message.sender) {
      const user = event.message.sender as Api.User;
      if (user.bot || user.verified || user.self) return;
    }

    if (event.isGroup) {
      if (!event.message.mentioned && !event.message.replyTo) return;
      const group = (await client.getEntity(event.chatId!)) as Api.Channel;
    }

    const afkInfo = afk.getAfk();
    await event.message.reply({
      message:
        `I am currently AFK. Please don't spam & wait for my response\n\n` +
        `&#9055; <b>Reason :</b> <code>${afkInfo.reason}</code>\n` +
        `&#9055; <b>Since :</b> <code>${afkInfo.since}</code>`
    });
  },
  outgoing: false,
  incoming: true
};

const AFK_CMD: LGPlugin = {
  handler: async (event, client) => {
    const { args } = extract(event.message.message);
    const reason = args ?? 'Not Mentioned';

    if (event.isGroup) {
      const group = (await client.getEntity(event.chatId!)) as Api.Channel;
      console.log(group);
    }

    afk.setAfk(reason);
    await event.message.edit({
      text: `AFK Mode on\n\n&#9055; <b>Reason :</b> <code>${reason}</code>`
    });
    await sleep(2500);
    await event.message.delete({ revoke: true });
  },
  commands: 'afk',
  allowArgs: true
};

export default [AFK_HANDLE, AFK_CMD];
