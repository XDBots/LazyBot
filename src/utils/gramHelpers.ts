import { Api } from 'telegram';

export const BlockUser = (id: number) => new Api.contacts.Block({ id });
export const GetFullUser = (id: number) =>
  new Api.users.GetFullUser({
    id
  });
