import { Api } from 'telegram';
import { afk, sleep, extract, LazyLogger } from '../helpers';

const AFK_HANDLE: LBPlugin = {
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

const AFK_CMD: LBPlugin = {
  handler: async (event) => {
    const { args } = extract(event.message.message);
    const reason = args || 'Not Mentioned';

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

const AFK_STOP: LBPlugin = {
  handler: async (e, client) => {
    // Don't run on afk command itself as pattern is wild card
    if (e.message.message.match(/afk/)) return;
    await sleep(2500);
    if (!afk.isAfk) return;
    await LazyLogger.log(client, afk.WatchList);
    afk.stopAfk();
  },
  pattern: /.*/,
  outgoing: true,
  incoming: false
};

export default [AFK_HANDLE, AFK_CMD, AFK_STOP];
export const help =
  `AFK stands for Away From Keyboard. If you turn on AFK mode before going offline, when someone PM/Mentions you, will be notified that you are offline.\n\n` +
  `<b>Examples : </b>\n\n` +
  `• <code>{}afk</code> : Turns on AFK\n` +
  `• <code>{}afk having party</code> : Turns on AFK with reason set to 'having party'\n\n` +
  `AFK Mode will be turned off automatically if you send any message and received PM/Mentions will be logged in the Log Chat`;
