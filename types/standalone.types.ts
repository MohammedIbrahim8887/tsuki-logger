import type { Logger as WinstonLogger } from 'winston';

export type LogLevel = 'error' | 'critical' | 'warning' | 'info' | 'success' | 'debug' | 'table';

export interface StandaloneLogger extends WinstonLogger {
  success: (message: string, meta?: unknown) => void;
  critical: (message: string, meta?: unknown) => void;
  table: (message: string, data?: unknown) => void;
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

export type RuntimeType = 'bun' | 'node';

export interface RuntimeAdapter {
  readonly type: RuntimeType;
  readonly isBun: boolean;
  readonly isNode: boolean;
  
  file: {
    existsSync: (path: string) => boolean;
    mkdirSync: (path: string, options?: { recursive?: boolean }) => void;
    writeFileSync: (path: string, data: string) => void;
  };
  
  path: {
    join: (...paths: string[]) => string;
  };
  
  env: {
    get: (key: string) => string | undefined;
  };
  
  cwd: () => string;
}
