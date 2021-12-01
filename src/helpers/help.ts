class HelpLoader {
  private help: Map<string, string>;

  constructor() {
    this.help = new Map<string, string>();
  }

  addHelp(file: string, doc: string) {
    this.help.set(file, doc);
  }

  getPluginList() {
    return Array.from(this.help.keys());
  }

  getHelp(file: string) {
    return this.help.get(file) ?? `<code>No plugin found</code>`;
  }
}

export const LazyHelp = new HelpLoader();
