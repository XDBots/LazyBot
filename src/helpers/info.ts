const lazy = require('../../package.json');
import { toHHMMSS } from '../utils/time';
import os from 'os';

class InfoHelper {
  constructor() {}

  getInfo() {
    const uptime = toHHMMSS(Math.floor(process.uptime()));
    const version = lazy.version;
    const { system, user } = process.cpuUsage();
    const cpuUsage = ((system / user) * 100).toFixed(2);
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ramUsage = ((usedRam / totalRam) * 100).toFixed(2);

    return (
      `<b>LazyBot</b> (<code>${version}</code>)\n\n` +
      `&#9055; Uptime : <code>${uptime}</code>\n` +
      `&#9055; System : <code>${os.version()}-${os.arch}</code>\n` +
      `&#9055; CPU Usage : <code>${cpuUsage}%</code>\n` +
      `&#9055; RAM Usage : <code>${ramUsage}%</code>\n\n`
    );
  }
}

export const LazyInfoHelper = new InfoHelper();
