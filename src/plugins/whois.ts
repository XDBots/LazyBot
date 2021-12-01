import { Api } from 'telegram';
import { escape } from 'html-escaper';
import { GetFullUser, LazyFileHelper } from '../helpers';

const getUserInfoText = (fulluser: Api.UserFull) => {
  const user = fulluser.user as Api.User;
  const fName = user.firstName ? user.firstName.replace('\u2060', '') : '';
  const lName = user.lastName ? user.lastName.replace('\u2060', '') : '';
  const uName = user.username ? '@' + user.username : '<code>None</code>';
  const dcId =
    user.photo && 'dcId' in user.photo ? user.photo.dcId : "Can't check";

  return (
    `<b>&#9055; First Name &#10143; </b><code>${escape(fName)}</code>\n` +
    `<b>&#9055; Last Name &#10143; </b><code>${escape(lName)}</code>\n` +
    `<b>&#9055; Username &#10143; </b>${uName}\n` +
    `<b>&#9055; User ID &#10143; </b><code>${user.id}</code>\n` +
    `<b>&#9055; DC ID &#10143; </b><code>${dcId}</code>\n` +
    `<b>&#9055; Bio &#10143; </b><code>${fulluser.about ?? ''}</code>\n` +
    `<b>&#9055; Restricted &#10143; </b><code>${user.restricted}</code>\n` +
    `<b>&#9055; Verified &#10143; </b><code>${user.verified}</code>\n` +
    `<b>&#9055; Scammer &#10143; </b><code>${user.verified}</code>\n` +
    `<b>&#9055; Bot &#10143; </b><code>${user.bot}</code>\n`
  );
};

const WHOIS: LBPlugin = {
  handler: async (event, client) => {
    const args = event.message.patternMatch![2];

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
    LazyFileHelper.saveFile(image, filename);
    event.message.delete({ revoke: true });

    if (Buffer.compare(image, Buffer.from(''))) {
      // User has a profile pic
      await client.sendFile(event.chatId!, {
        file: `./downloads/${filename}`,
        forceDocument: false,
        caption: getUserInfoText(fulluser)
      });
      LazyFileHelper.deleteFile(filename);
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
export const help =
  '<i>Provides user information of username/user id/replied user</i>\n\n' +
  `<b>Examples :</b>\n\n` +
  `• <code>{}whois</code>\n` +
  `• <code>{}whois 777000</code>\n` +
  `or reply <code>{}whois</code> to someone's messages`;
