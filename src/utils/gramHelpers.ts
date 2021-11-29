import { Api, TelegramClient } from 'telegram';

export const BlockUser = (id: number) => new Api.contacts.Block({ id });
export const GetFullUser = async (
  id: number | string,
  client: TelegramClient
) => {
  if (typeof id === 'string' && /^\d+$/.test(id)) {
    id = parseInt(id);
  }

  const entity = await client.getEntity(id);
  return await client.invoke(new Api.users.GetFullUser({ id: entity }));
};
