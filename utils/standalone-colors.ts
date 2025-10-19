import chalk from 'chalk';

export const LOG_LEVEL_COLORS = {
  error: 'red',
  critical: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
  debug: 'cyan',
  table: 'white'
} as const;

export function getColoredLevel(level: string): string {
  switch (level) {
    case 'error':
      return chalk.red.bold('ERROR');
    case 'warning':
    case 'warn':
      return chalk.yellow.bold('WARN');
    case 'info':
      return chalk.blue.bold('INFO');
    case 'critical':
      return chalk.magenta.bold('CRITICAL');
    case 'debug':
      return chalk.cyan.bold('DEBUG');
    case 'success':
      return chalk.green.bold('SUCCESS');
    case 'table':
      return chalk.white.bold('TABLE');
    default:
      return chalk.white.bold(level.toUpperCase());
  }
}

export function getTimestampColor(timestamp: string): string {
  return chalk.gray(`[${timestamp}]`);
}

export function getTableColor(message: string): string {
  return chalk.white.bold(message);
}
