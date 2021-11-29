const Hello: LGPlugin = {
  handler: async (event) => {
    await event.message.edit({
      text: 'Konichiwa!'
    });
  },
  commands: ['hello', 'hi']
};

export default [Hello];
