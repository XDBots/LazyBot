import env from '../env';

export const extract = (text: string) => {
  const parts = new RegExp(
    `^\\${env.CMD_PREFIX}(\\w*)\\s?([a-zA-Z\\s]*)?`
  ).exec(text);

  return {
    command: Array.isArray(parts) ? parts[1] : null,
    args: Array.isArray(parts) ? parts[2] : null
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
        ? `^(\\${env.CMD_PREFIX}${cmds})(\\s.*)?$`
        : `^(\\${env.CMD_PREFIX}${cmds})$`
    );
  }
  return new RegExp(
    allowArgs
      ? `^(\\${env.CMD_PREFIX}${cmd})(\\s.*)?$`
      : `^(\\${env.CMD_PREFIX}${cmd})$`
  );
};
