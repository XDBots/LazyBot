const lazy = require('../../package.json');
import os from 'os';
import { toHHMMSS, LazyExec } from '../utils';
class InfoHelper {
  constructor() {}

  get version() {
    return lazy.version as string;
  }

  async neofetchOS() {
    const sysinfo = await LazyExec(
      'neofetch --disable kernel uptime packages shell cpu memory --stdout'
    );
    return sysinfo.split('\n')[2] || 'Linux';
  }

  async getInfo() {
    let system = os.version();
    if (os.type() === 'Linux') {
      system = await this.neofetchOS();
    }

    const uptime = toHHMMSS(Math.floor(process.uptime()));
    const version = lazy.version;
    const cpu = process.cpuUsage();
    const cpuUsage = ((cpu.system / cpu.user) * 100).toFixed(2);
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ramUsage = ((usedRam / totalRam) * 100).toFixed(2);

    return (
      `<b><u>LazyBot</u></b> (<code>${version}</code>)\n\n` +
      `&#9055; <b>Uptime :</b> <code>${uptime}</code>\n` +
      `&#9055; <b>System :</b> <code>${system}-${os.arch}</code>\n` +
      `&#9055; <b>CPU Usage :</b> <code>${cpuUsage}%</code>\n` +
      `&#9055; <b>RAM Usage :</b> <code>${ramUsage}%</code>\n\n`
    );
  }
}

export const LazyInfoHelper = new InfoHelper();
