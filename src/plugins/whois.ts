import { Api } from 'telegram';
import { extract, GetFullUser, LazyFileHelper } from '../utils';
import { escape } from 'html-escaper';

const getUserInfoText = (fulluser: Api.UserFull) => {
  const user = fulluser.user as Api.User;
  const fName = user.firstName ? user.firstName.replace('\u2060', '') : '';
  const lName = user.lastName ? user.lastName.replace('\u2060', '') : '';
  const uName = user.username ? '@' + user.username : '<code>None</code>';
  const dcId =
    user.photo && 'dcId' in user.photo ? user.photo.dcId : "Can't check";

  return (
    `<b>First Name &#10143; </b><code>${escape(fName)}</code>\n` +
    `<b>Last Name &#10143; </b><code>${escape(lName)}</code>\n` +
    `<b>Username &#10143; </b>${uName}\n` +
    `<b>User ID &#10143; </b><code>${user.id}</code>\n` +
    `<b>DC ID &#10143; </b><code>${dcId}</code>\n` +
    `<b>Bio &#10143; </b><code>${fulluser.about}</code>\n` +
    `<b>Restricted &#10143; </b><code>${user.restricted}</code>\n` +
    `<b>Verified &#10143; </b><code>${user.verified}</code>\n` +
    `<b>Scammer &#10143; </b><code>${user.verified}</code>\n` +
    `<b>Bot &#10143; </b><code>${user.bot}</code>\n`
  );
};

const WHOIS: LGPlugin = {
  handler: async (event, client) => {
    const { args } = extract(event.message.message);

    let userid: number | string = 'me';

    if (event.isPrivate) {
      userid = event.chatId!;
    }

    if (args) {
      userid = args;
    }

    if (event.message.replyToMsgId) {
      const repliedToMessage = await event.message.getReplyMessage();
      if (repliedToMessage) {
        // @ts-ignore
        userid = repliedToMessage.fromId.userId;
      }
    }

    const fulluser = await GetFullUser(userid, client);

    const image = await client.downloadProfilePhoto(fulluser.user, {
      isBig: true
    });

    const filename = 'pfp' + fulluser.user.id.toString() + '.jpg';
    LazyFileHelper.saveFileFromBuffer(image, filename);
    await event.message.delete({ revoke: false });

    if (Buffer.compare(image, Buffer.from(''))) {
      // User has a profile pic
      await client.sendFile(event.chatId!, {
        file: `./downloads/${filename}`,
        forceDocument: false,
        caption: getUserInfoText(fulluser)
      });
      LazyFileHelper.deleteDownloaded(filename);
    } else {
      // User doesn't have a profile pic
      await client.sendMessage(event.chatId!, {
        message: getUserInfoText(fulluser)
      });
    }
  },
  commands: 'whois',
  allowArgs: true
};

export default [WHOIS];
export const help: LGHelp = (prefix) =>
  `<i>Examples :</i>\n` +
  `<code>${prefix}whois</code>\n` +
  `<code>${prefix}whois 777000</code>\n` +
  `or reply <code>${prefix}whois</code> to someone's messages`;
