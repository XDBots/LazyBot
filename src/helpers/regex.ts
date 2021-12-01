import env from '../env';

export const extract = (text: string) => {
  const parts = new RegExp(`^\\${env.CMD_PREFIX}(\\w*)\\s?(.*)?`).exec(text);
  return {
    command: parts ? parts[1] : '',
    args: parts && parts[2] ? parts[2].trim() : ''
  };
};

export const getPatternFromCmd = (
  cmd: string | string[],
  allowArgs: boolean = false
): RegExp => {
  if (Array.isArray(cmd)) {
    const cmds = cmd.reduce((prev, current) => prev + '|' + current, '');
    return new RegExp(
      allowArgs
        ? `^\\${env.CMD_PREFIX}(${cmds})(\\s.*)?$`
        : `^\\${env.CMD_PREFIX}(${cmds})$`
    );
  }
  return new RegExp(
    allowArgs
      ? `^\\${env.CMD_PREFIX}(${cmd})(\\s.*)?$`
      : `^\\${env.CMD_PREFIX}(${cmd})$`
  );
};
