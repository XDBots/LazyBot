import fs from 'fs';
import path from 'path';

class FileHelper {
  constructor() {}

  async init() {
    fs.mkdir(
      path.join(process.cwd(), 'downloads'),
      { recursive: true },
      (error) => {
        error &&
          console.error('[LazyBot]' + `[${error.name}] => ` + error.message);
      }
    );
  }

  saveFileFromBuffer(data: Buffer, filename: string) {
    fs.writeFile(
      path.join(process.cwd(), 'downloads', filename),
      data,
      (error) => {
        error &&
          console.error('[LazyBot]' + `[${error.name}] => ` + error.message);
      }
    );
  }

  deleteDownloaded(filename: string) {
    fs.rm(path.join(process.cwd(), 'downloads', filename), (error) => {
      error &&
        console.error('[LazyBot]' + `[${error.name}] => ` + error.message);
    });
  }
}

export const LazyFileHelper = new FileHelper();
