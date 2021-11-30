import fs from 'fs';
import path from 'path';
import { getPatternFromCmd } from '../helpers/regexHelpers';
import { TelegramClient } from 'telegram';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { LazyHelp } from './helpLoader';
import env from '../env';

class PluginLoader {
  private commands: Map<string, LGPlugin['handler']>;

  constructor() {
    this.commands = new Map<string, LGPlugin['handler']>();
  }

  private validate(plugin: LGPlugin) {
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
  }

  addPlugin(plugin: LGPlugin, client: TelegramClient) {
    const handler = async (event: NewMessageEvent) => {
      try {
        if (event.message.fwdFrom) return;
        await plugin.handler(event, client);
      } catch (e) {
        const error =
          e instanceof Error
            ? `<b>[${e.name}] =></b> <code>${e.message}</code>`
            : `<code>${String(e)}</code>`;
        try {
          event.message.edit({
            text: error
          });
          client.sendMessage(env.LOG_CHAT_ID, { message: error });
        } catch (e) {
          console.log('[LazyGram][Error] => ' + String(e));
        }
      }
    };

    client.addEventHandler(
      handler,
      new NewMessage({
        outgoing: plugin.outgoing ?? true,
        incoming: plugin.incoming ?? false,
        pattern: plugin.commands
          ? getPatternFromCmd(plugin.commands, plugin.allowArgs)
          : plugin.pattern
      })
    );
  }

  async load(client: TelegramClient) {
    console.info('[LazyGram] => Looking For Plugins...');
    const pluginFiles = fs
      .readdirSync(
        path.join(
          process.cwd(),
          __dirname.includes('/src/') ? 'src' : 'build',
          'plugins'
        )
      )
      .filter((file) => ['ts', 'js'].includes(file.slice(-2)));

    console.info(`[LazyGram] => Found ${pluginFiles.length} Plugin Files...\n`);

    console.info('[LazyGram] => Loading Plugins...');
    for (const file of pluginFiles) {
      const filename = file.slice(0, -3);
      let xdplug = await import(
        path.join(
          process.cwd(),
          __dirname.includes('/src/') ? 'src' : 'build',
          'plugins',
          filename
        )
      );

      let plugin = xdplug.default as LGPlugin | LGPlugin[];
      if (!plugin) {
        return console.log('[LazyGram] => Failed to Load Plugin - ' + filename);
      }

      let help = xdplug.help as string;
      if (!help) {
        help = '<code>No Docs Provided by Plugin Developer</code>';
      }

      if (!Array.isArray(plugin)) {
        plugin = [plugin];
      }

      for (let pl of plugin) {
        if (!this.validate(pl)) return;
        this.addPlugin(pl, client);
      }

      LazyHelp.addHelp(filename, help.replace(/{}/g, env.CMD_PREFIX));
      console.info('[LazyGram] => Loaded Plugin File - ' + filename);
    }
  }
}

export const plugins = new PluginLoader();
