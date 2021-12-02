import { toHHMMSS } from '../utils/time';
import { escape } from 'html-escaper';
import { BigInteger } from 'big-integer';

interface AFKPM {
  name: string;
  userid: string | BigInteger;
}

interface AFKGROUP {
  title: string;
  link: string;
  by: {
    id: string | BigInteger;
    name: string;
  };
}

type AFKWatchList = AFKPM | AFKGROUP;

class AfkHelper {
  private _isAfk: boolean;
  private _afkReason: string;
  private _afkSince: Date;
  private _afkWatchList: Set<string>;
  constructor() {
    this._isAfk = false;
    this._afkReason = 'Not Mentioned';
    this._afkSince = new Date();
    this._afkWatchList = new Set<string>();
  }

  private reset() {
    this._isAfk = false;
    this._afkReason = 'Not Mentioned';
    this._afkSince = new Date();
    this._afkWatchList.clear();
  }

  private calculateAfkSince() {
    const now = new Date();
    let secs = (now.getTime() - this._afkSince.getTime()) / 1000;
    return toHHMMSS(Math.floor(secs));
  }

  setAfk(reason: string) {
    this._isAfk = true;
    this._afkSince = new Date();
    this._afkReason = reason.trim();
  }

  stopAfk() {
    this.reset();
  }

  get isAfk() {
    return this._isAfk;
  }

  getAfk() {
    return {
      isAfk: this._isAfk,
      since: this.calculateAfkSince(),
      reason: this._afkReason
    };
  }

  addWatch(data: AFKWatchList) {
    // Stringify Because -> { lazy: "lazy" } !== { lazy: "lazy" }
    this._afkWatchList.add(JSON.stringify(data));
  }

  get WatchList() {
    let msg = '';
    this._afkWatchList.forEach((v) => {
      const value = JSON.parse(v) as AFKWatchList;
      if ('userid' in value) {
        const data = value as AFKPM;
        msg += `&#9055; <a href="tg://user?id=${data.userid}">${escape(
          data.name
        )}</a> has PMed you\n`;
      } else {
        const data = value as AFKGROUP;
        msg += `&#9055; <a href="tg://user?id=${data.by.id}">${escape(
          data.by.name
        )}</a> mentioned you in <a href="${data.link}"/>${escape(
          data.title
        )}</a>\n`;
      }
    });
    return msg;
  }
}

export const afk = new AfkHelper();
