import { Api } from 'telegram';
import { extract, GetFullUser, LazyFileHelper } from '../utils';
import { escape } from 'html-escaper';

const getUserInfoText = (user: Api.User) => {
  user.firstName ? user.firstName.replace('\u2060', '') : (user.firstName = '');
  user.lastName ? user.lastName.replace('\u2060', '') : (user.lastName = '');

  return (
    `<b>First Name &#10143; </b><code>${escape(user.firstName)}</code>\n` +
    `<b>Last Name &#10143; </b><code>${escape(user.lastName)}</code>\n` +
    `<b>Username &#10143; </b>${user.username ? '@' + user.username : ''}\n` +
    `<b>User ID &#10143; </b><code>${user.id}</code>`
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

    const fulluser = await GetFullUser(userid, client);
    const user = fulluser.user as Api.User;
    const image = await client.downloadProfilePhoto(user, {
      isBig: true
    });

    const filename = 'pfp' + user.id.toString() + '.jpg';
    LazyFileHelper.saveFileFromBuffer(image, filename);
    await event.message.delete({ revoke: false });

    if (Buffer.compare(image, Buffer.from(''))) {
      // User has a profile pic
      await client.sendFile(event.chatId!, {
        file: `./downloads/${filename}`,
        forceDocument: false,
        caption: getUserInfoText(user)
      });
      LazyFileHelper.deleteDownloaded(filename);
    } else {
      // User doesn't have a profile pic
      await client.sendMessage(event.chatId!, {
        message: getUserInfoText(user)
      });
    }
  },
  commands: 'whois',
  allowArgs: true
};

export default [WHOIS];
export const help: LGHelp = (prefix) =>
  `<b>${prefix}whois :</b> <code>Shows User Details</code>\n` +
  `e.g:\n` +
  `<code>${prefix}whois</code>\n` +
  `<code>${prefix}whois 777000</code>`;
