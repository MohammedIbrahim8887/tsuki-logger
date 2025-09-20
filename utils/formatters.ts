import winston from 'winston';
import { getColoredLevel, getTimestampColor } from './colors';

export const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const coloredLevel = getColoredLevel(level);
    const coloredTimestamp = getTimestampColor(`[${timestamp}]`);
    const metaString = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : '';

    return `${coloredTimestamp} ${coloredLevel} ${message}${metaString}`;
  })
);

export const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const cleanMessage = (message as string).replace(/\u001b\[[0-9;]*m/g, '');
    const metaString = Object.keys(meta).length
      ? ` ${JSON.stringify(meta)}`
      : '';

    return `[${timestamp}] ${level.toUpperCase()} ${cleanMessage}${metaString}`;
  })
);

export const jsonFileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

export function cleanAnsiCodes(message: string): string {
  return message.replace(/\u001b\[[0-9;]*m/g, '');
}

export function formatMeta(meta: Record<string, unknown>): string {
  return Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
}
