const lazy = require('../../package.json');
import os from 'os';

class InfoHelper {
  constructor() {}

  // https://stackoverflow.com/a/34841026/12250600
  toHHMMSS(secs: number) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor(secs / 60) % 60;
    var seconds = secs % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }

  getInfo() {
    const uptime = this.toHHMMSS(Math.floor(process.uptime()));
    const version = lazy.version;
    const { system, user } = process.cpuUsage();
    const cpuUsage = ((system / user) * 100).toFixed(2);
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ramUsage = ((usedRam / totalRam) * 100).toFixed(2);

    return (
      `<b>LazyGram</b> (<code>${version}</code>)\n\n` +
      `&#9055; Uptime : <code>${uptime}</code>\n` +
      `&#9055; System : <code>${os.version()}-${process.arch}</code>\n` +
      `&#9055; CPU Usage : <code>${cpuUsage}%</code>\n` +
      `&#9055; RAM Usage : <code>${ramUsage}%</code>\n\n`
    );
  }
}

export const LazyInfoHelper = new InfoHelper();
