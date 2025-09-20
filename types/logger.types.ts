import type { Logger as WinstonLogger, LeveledLogMethod } from 'winston';

export type LogLevel = 'error' | 'critical' | 'warning' | 'info' | 'success' | 'debug' | 'table';

export interface LoggerConfig {
  level?: LogLevel;
  autoLogging?: boolean | { ignore?: (ctx: any) => boolean };
  customProps?: (ctx: any) => Record<string, unknown>;
  logErrors?: boolean;
}

export interface StandaloneLogger extends WinstonLogger {
  success: (message: string, meta?: unknown) => void;
  critical: (message: string, meta?: unknown) => void;
  table: (message: string, data?: unknown) => void;
}

export interface TsukiLogger extends WinstonLogger {
  success: (message: string, meta?: unknown) => void;
  critical: (message: string, meta?: unknown) => void;
  table: (message: string, data?: unknown) => void;
  warn: LeveledLogMethod;
  warning: LeveledLogMethod;
}

export interface CallerLocation {
  file: string;
  line: number | null;
}

export interface LogLevels {
  error: 0;
  critical: 1;
  warning: 2;
  info: 3;
  success: 4;
  debug: 5;
  table: 6;
  [key: string]: number;
}

export interface ColorConfig {
  error: string;
  critical: string;
  warning: string;
  info: string;
  success: string;
  debug: string;
  table: string;
}
