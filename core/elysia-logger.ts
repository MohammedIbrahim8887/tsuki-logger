import winston from 'winston';
import { Elysia } from 'elysia';
import { runtime, createLogDir } from '../utils';
import { consoleFormat, fileFormat } from '../utils/formatters';
import { getMethodColor, getStatusColor, getArrowForMethod, getResponseTimeColor } from '../utils/colors';
import { resolveStatusCode, shouldLogTable } from '../utils/helpers';
import type { LoggerConfig, TsukiLogger, LogLevels, ElysiaContext, ResolveCtx } from '../types';

export function createLogger(config: LoggerConfig = {}) {
  const {
    level = runtime.env.get('NODE_ENV') === 'production' ? 'info' : 'debug',
    autoLogging = true,
    customProps,
    logErrors = true,
  } = config;

  const logDir = createLogDir(runtime);

  const logger = winston.createLogger({
    level,
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
        level: level,
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

  const tsukiLogger = logger as TsukiLogger;

  tsukiLogger.success = (message: string, meta?: unknown) => {
    logger.log('success', message, meta);
  };

  tsukiLogger.critical = (message: string, meta?: unknown) => {
    logger.log('critical', message, meta);
  };

  tsukiLogger.table = (message: string, data?: unknown) => {
    if (data && typeof data === 'object') {
      if (shouldLogTable()) {
        console.log('TABLE:', message);
        console.table(data);
      }
      logger.log('table', message, { tableData: data });
    } else {
      logger.log('table', message, data);
    }
  };

  return new Elysia({ name: 'logger' })
    .decorate('log', tsukiLogger)
    .derive({ as: 'scoped' }, () => ({
      startTime: performance.now(),
    }))
    .onAfterResponse({ as: 'scoped' }, (ctx) => {
      if (autoLogging === false) return;
      const shouldIgnore =
        typeof autoLogging === 'object' &&
        autoLogging.ignore?.(ctx as unknown as ElysiaContext);
      if (shouldIgnore) return;

      const responseTime = Math.round(
        performance.now() - (ctx as ElysiaContext).startTime!
      );
      const method = (ctx as ElysiaContext).request.method;
      const url = (ctx as ElysiaContext).request.url
        ? new URL((ctx as ElysiaContext).request.url).pathname
        : (ctx as ElysiaContext).path || '/';
      const statusCode = resolveStatusCode(ctx as ResolveCtx, 200, 500);

      if ((ctx as ElysiaContext).error || statusCode >= 400) {
        return;
      }

      const methodColor = getMethodColor(method);
      const statusColor = getStatusColor(statusCode);

      if (level === 'info') {
        const arrow = getArrowForMethod(method);
        const simpleLogMessage = `${methodColor} ${arrow} ${statusColor} ${url}`;
        if (statusCode >= 400) {
          tsukiLogger.error(simpleLogMessage);
        } else {
          tsukiLogger.info(simpleLogMessage);
        }
      } else {
        const timeColor = getResponseTimeColor(responseTime);
        const logMessage = `${methodColor} ${url} ${statusColor} ${timeColor}`;
        if (statusCode >= 400) {
          tsukiLogger.error(logMessage, {
            type: 'http_request',
            method,
            url,
            statusCode,
            responseTime,
          });
        } else {
          tsukiLogger.info(logMessage, {
            type: 'http_request',
            method,
            url,
            statusCode,
            responseTime,
          });
        }
        const additionalProps = customProps
          ? customProps(ctx as unknown as ElysiaContext)
          : {};
        if (additionalProps && Object.keys(additionalProps).length > 0) {
          tsukiLogger.debug('Request context', additionalProps);
        }
      }
    })
    .onError({ as: 'scoped' }, (ctx) => {
      if (!logErrors) return;

      const responseTime = Math.round(
        performance.now() - (ctx as ElysiaContext).startTime!
      );
      const method = (ctx as ElysiaContext).request.method;
      const url = (ctx as ElysiaContext).request.url
        ? new URL((ctx as ElysiaContext).request.url).pathname
        : (ctx as ElysiaContext).path || '/';
      const statusCode = resolveStatusCode(ctx as ResolveCtx, 200, 500, true);

      try {
        (ctx as ElysiaContext).set!.status = statusCode;
      } catch {}

      const methodColor = getMethodColor(method);
      const statusColor = getStatusColor(statusCode);

      if (level === 'info') {
        const arrow = getArrowForMethod(method);
        const simpleLogMessage = `${methodColor} ${arrow} ${statusColor} ${url}`;
        tsukiLogger.error(simpleLogMessage);
      } else {
        const timeColor = getResponseTimeColor(responseTime);
        const logMessage = `${methodColor} ${url} ${statusColor} ${timeColor}`;
        const additionalProps = customProps
          ? customProps(ctx as unknown as ElysiaContext)
          : {};
        tsukiLogger.error(logMessage, {
          type: 'http_error',
          method,
          url,
          statusCode,
          responseTime,
          error:
            (ctx as ElysiaContext).error?.message ??
            'Unknown error',
          stack: (ctx as ElysiaContext).error?.stack,
          ...additionalProps,
        });
      }
    });
}

winston.addColors({
  error: 'red',
  critical: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
  debug: 'cyan',
  table: 'white',
});
