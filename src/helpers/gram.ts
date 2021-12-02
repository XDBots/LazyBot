import { Api, TelegramClient } from 'telegram';

export const BlockUser = (id: Api.long) => new Api.contacts.Block({ id });

export const GetFullUser = async (id: Api.long, client: TelegramClient) => {
  const entity = await client.getEntity(id);
  return await client.invoke(new Api.users.GetFullUser({ id: entity }));
};
