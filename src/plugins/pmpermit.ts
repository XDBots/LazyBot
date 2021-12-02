import { prisma } from '../prisma';
import { BlockUser, sleep } from '../helpers';
import { Api } from 'telegram';
import env from '../env';

const warnuser = (warns: number): string => {
  return (
    `<code>This is an automated reply</code>\n\n` +
    `<i>Please wait for master to approve your inbox request\n` +
    `If you keep spamming you will be blocked and reported automatcally</i>\n\n` +
    `<b>Warns :</b> <code>${warns}</code>`
  );
};

const PMPERMIT: LBPlugin = {
  handler: async (event, client) => {
    if (!event.isPrivate || !event.message.senderId) return;

    const sender = (await event.message.getSender()) as Api.User;
    if (sender.self || sender.id === '777000' || sender.bot) return;
    const senderId = sender.id.toString();

    let user = await prisma.pmPermit.findUnique({
      where: { id: senderId }
    });

    if (user?.approved) {
      await prisma.$disconnect();
      return;
    }

    if (!user) {
      user = await prisma.pmPermit.create({
        data: { id: senderId, warns: 1 }
      });
    } else {
      await prisma.pmPermit.update({
        where: { id: senderId },
        data: { warns: ++user.warns }
      });
    }
    await prisma.$disconnect();

    if (user.warns > env.PM_PERMIT_MAX_WARNS) {
      await client.sendMessage(senderId, {
        message: '<code>You Have Been Blocked</code>'
      });
      await client.invoke(BlockUser(senderId));

      return;
    } else {
    }

    if (env.PM_PERMIT_MODE === 'text') {
      await event.message.reply({
        message: warnuser(user.warns)
      });
      return;
    }

    if (env.PM_PERMIT_MODE === 'media' && env.PM_PERMIT_MEDIA) {
      await event.message.reply({
        file: env.PM_PERMIT_MEDIA,
        forceDocument: false,
        message: warnuser(user.warns)
      });
    }
  },
  incoming: true,
  outgoing: false
};

const PMPERMIT_APPROVE: LBPlugin = {
  handler: async (event) => {
    if (event.isGroup || !event.chatId) {
      await event.message.edit({
        text: '<code>This command is allowed in private chats</code>'
      });
      return;
    }

    const user = await prisma.pmPermit.findFirst({
      where: { id: event.chatId.toString() }
    });

    if (user && user.approved) {
      await event.message.edit({
        text: '<code>User is already approved</code>'
      });
      await prisma.$disconnect();
      return;
    }

    await prisma.pmPermit.upsert({
      where: { id: event.chatId.toString() },
      update: { approved: true, warns: 0 },
      create: {
        id: event.chatId.toString(),
        approved: true
      }
    });
    await prisma.$disconnect();

    await event.message.edit({ text: `<b>User has been Approved</b>` });
    await sleep(2500);
    await event.message.delete({ revoke: true });
  },
  commands: ['a', 'approve']
};

const PMPERMIT_BLOCK: LBPlugin = {
  handler: async (event, client) => {
    if (event.isGroup || !event.chatId) {
      await event.message.edit({
        text: '<code>This command is allowed in private chats</code>'
      });
      return;
    }

    await prisma.pmPermit.upsert({
      where: { id: event.chatId.toString() },
      update: { approved: false },
      create: {
        id: event.chatId.toString(),
        approved: false
      }
    });

    await event.message.delete();
    await client.invoke(BlockUser(event.message.senderId!));
  },
  commands: ['unapprove', 'block']
};

export default [PMPERMIT, PMPERMIT_APPROVE, PMPERMIT_BLOCK];
export const help =
  '<i>PM Permit is a feature to prevent Inbox spamming and unwanted PMs</i>\n\n' +
  '<b>Available Commands : </b>\n\n' +
  "• <code>{}a</code> | <code>{}approve</code> : <i>Approves the user. Now Lazygram won't disturb the conversation</i>\n" +
  "• <code>{}unapprove</code> | <code>{}block</code> : <i>Doesn't accept the PM and blocks the user</i>";
