export const validate = (plugin: LGPlugin) => {
  if (!('handler' in plugin)) {
    console.warn(`[LazyGram] => Invalid Plugin - No Handler Found`);
    return false;
  }

  if (typeof plugin.handler !== 'function') {
    console.warn(`[LazyGram] => Invalid Plugin - Invalid Handler`);
    return false;
  }

  if (plugin.outgoing && !('commands' in plugin)) {
    console.warn(
      `[LazyGram] => Invalid Plugin - Commands are required for this Plugin`
    );
    return false;
  }

  return true;
};
