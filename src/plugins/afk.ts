import { Api } from 'telegram';
import { afk, sleep, extract, LazyLogger } from '../helpers';

const AFK_HANDLE: LGPlugin = {
  handler: async (event, client) => {
    if (!afk.isAfk) return;
    const user = (await event.message.getSender()) as Api.User;

    if (event.isPrivate && event.message.sender) {
      if (user.bot || user.verified) return;
      afk.addWatch({ name: user.firstName ?? '', userid: user.id });
    }

    if (event.isGroup) {
      if (!event.message.mentioned && !event.message.replyTo) return;
      const group = (await client.getEntity(event.chatId!)) as Api.Channel;
      if (group.username) {
        afk.addWatch({
          title: group.title,
          link: `https://t.me/${group.username}/${event._messageId}`,
          by: { name: user.firstName ?? '', id: user.id }
        });
      } else {
        afk.addWatch({
          title: group.title,
          link: `https://t.me/c/${group.id}/${event._messageId}`,
          by: { name: user.firstName ?? '', id: user.id }
        });
      }
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
  handler: async (event) => {
    const { args } = extract(event.message.message);
    const reason = args ?? 'Not Mentioned';

    await event.message.edit({
      text: `AFK Mode on\n\n&#9055; <b>Reason :</b> <code>${reason}</code>`
    });

    afk.setAfk(reason);
    await sleep(2500);
    await event.message.delete({ revoke: true });
  },
  commands: 'afk',
  allowArgs: true
};

const AFK_STOP: LGPlugin = {
  handler: async (e, client) => {
    // Don't run on afk command itself as pattern is wild card
    if (e.message.message.match(/afk/)) return;
    if (!afk.isAfk) return;
    await LazyLogger.log(client, afk.WatchList);
    afk.stopAfk();
  },
  pattern: /.*/,
  outgoing: true,
  incoming: false
};

export default [AFK_HANDLE, AFK_CMD, AFK_STOP];
