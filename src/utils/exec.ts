import { exec } from 'child_process';

export const LazyExec = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return;
      if (stdout) {
        return resolve(stdout);
      }
      if (stderr) {
        return reject(stderr);
      }
    });
  });
};
