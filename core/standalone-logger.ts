import winston from 'winston';
import { runtime, createLogDir } from '../utils';
import { consoleFormat, fileFormat } from '../utils/formatters';
import { getCallerLocation } from '../utils/helpers';
import type { StandaloneLogger, LogLevels } from '../types';

const logDir = createLogDir(runtime);

const logger = winston.createLogger({
  level: runtime.env.get('NODE_ENV') === 'production' ? 'info' : 'debug',
  levels: {
    error: 0,
    critical: 1,
    warning: 2,
    info: 3,
    success: 4,
    debug: 5,
    table: 6,
  } as LogLevels,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: runtime.path.join(logDir, 'log.txt'),
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: runtime.path.join(logDir, 'log.error.txt'),
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: runtime.path.join(logDir, 'log.debug.txt'),
      level: 'debug',
      format: fileFormat,
    }),
  ],
});

const standaloneLogger = logger as StandaloneLogger;

const wrapLeveled = (
  original: winston.LeveledLogMethod
): winston.LeveledLogMethod => {
  const wrapped = (
    messageOrInfo: unknown,
    ...meta: unknown[]
  ): winston.Logger => {
    if (typeof messageOrInfo === 'string') {
      const { file, line } = getCallerLocation();
      const suffix = line ? ` (${file}:${line})` : ` (${file})`;
      const [message, ...rest] = [messageOrInfo, ...meta] as [
        string,
        ...unknown[],
      ];
      return original(`${message}${suffix}`, ...(rest as []));
    }
    return original(messageOrInfo as object);
  };
  return wrapped as unknown as winston.LeveledLogMethod;
};

(standaloneLogger as unknown as { debug: winston.LeveledLogMethod }).debug =
  wrapLeveled(
    standaloneLogger.debug.bind(standaloneLogger) as winston.LeveledLogMethod
  );
(standaloneLogger as unknown as { info: winston.LeveledLogMethod }).info =
  wrapLeveled(
    standaloneLogger.info.bind(standaloneLogger) as winston.LeveledLogMethod
  );
(standaloneLogger as unknown as { error: winston.LeveledLogMethod }).error =
  wrapLeveled(
    standaloneLogger.error.bind(standaloneLogger) as winston.LeveledLogMethod
  );
if (
  typeof (standaloneLogger as unknown as Record<string, unknown>).warn ===
  'function'
) {
  (standaloneLogger as unknown as { warn: winston.LeveledLogMethod }).warn =
    wrapLeveled(
      (standaloneLogger.warn as unknown as winston.LeveledLogMethod).bind(
        standaloneLogger
      )
    );
}
if (
  typeof (standaloneLogger as unknown as Record<string, unknown>).warning ===
  'function'
) {
  (
    standaloneLogger as unknown as { warning: winston.LeveledLogMethod }
  ).warning = wrapLeveled(
    (standaloneLogger.warning as unknown as winston.LeveledLogMethod).bind(
      standaloneLogger
    )
  );
}

standaloneLogger.success = (message: string, meta?: unknown) => {
  const { file, line } = getCallerLocation();
  const suffix = line ? ` (${file}:${line})` : ` (${file})`;
  const finalMessage =
    typeof message === 'string' ? `${message}${suffix}` : message;
  logger.log('success', finalMessage, meta);
};

standaloneLogger.critical = (message: string, meta?: unknown) => {
  const { file, line } = getCallerLocation();
  const suffix = line ? ` (${file}:${line})` : ` (${file})`;
  const finalMessage =
    typeof message === 'string' ? `${message}${suffix}` : message;
  logger.log('critical', finalMessage, meta);
};

standaloneLogger.table = (message: string, data?: unknown) => {
  if (data && typeof data === 'object') {
    if (runtime.env.get('NODE_ENV') !== 'production') {
      console.log('TABLE:', message);
      console.table(data);
    }
    const { file, line } = getCallerLocation();
    const suffix = line ? ` (${file}:${line})` : ` (${file})`;
    const finalMessage =
      typeof message === 'string' ? `${message}${suffix}` : message;
    logger.log('table', finalMessage, { tableData: data });
  } else {
    const { file, line } = getCallerLocation();
    const suffix = line ? ` (${file}:${line})` : ` (${file})`;
    const finalMessage =
      typeof message === 'string' ? `${message}${suffix}` : message;
    logger.log('table', finalMessage, data);
  }
};

winston.addColors({
  error: 'red',
  critical: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
  debug: 'cyan',
  table: 'white',
});

export { standaloneLogger as logger };
