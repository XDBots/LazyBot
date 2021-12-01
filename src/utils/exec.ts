import { exec } from 'child_process';

export const LazyExec = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return;
      stdout && resolve(stdout);
      stderr && reject(stderr);
    });
  });
};
