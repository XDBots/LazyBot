import { toHHMMSS } from '../utils/time';

class AfkHelper {
  private _isAfk: boolean;
  private _afkReason: string;
  private _afkSince: Date;
  constructor() {
    this._isAfk = false;
    this._afkReason = 'Not Mentioned';
    this._afkSince = new Date();
  }

  private reset() {
    this._isAfk = false;
    this._afkReason = 'Not Mentioned';
    this._afkSince = new Date();
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
}

export const afk = new AfkHelper();
