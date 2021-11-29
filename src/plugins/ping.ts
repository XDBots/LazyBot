const Ping: LGPlugin = {
  handler: async (event) => {
    const toSubtract = new Date().getTime();
    await event.message.edit({
      text: 'Pong...'
    });
    await event.message.edit({
      text:
        '<b>Pong =></b> <code>' +
        (new Date().getTime() - toSubtract) +
        '</code> ms'
    });
  },
  commands: 'ping',
  outgoing: true
};

export default [Ping];
