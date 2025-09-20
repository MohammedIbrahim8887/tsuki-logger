import chalk from 'chalk';
import type { LogLevel, HttpMethod } from '../types';

export const LOG_LEVEL_COLORS = {
  error: 'red',
  critical: 'magenta',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
  debug: 'cyan',
  table: 'white'
} as const;

export const HTTP_METHOD_COLORS = {
  GET: 'green',
  POST: 'blue',
  PUT: 'yellow',
  PATCH: 'magenta',
  DELETE: 'red'
} as const;

export const HTTP_STATUS_COLORS = {
  success: 'green',
  redirect: 'yellow',
  clientError: 'red',
  serverError: 'magenta'
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

export function getMethodColor(method: string): string {
  switch (method.toLowerCase()) {
    case 'get':
      return chalk.green.bold('GET');
    case 'post':
      return chalk.blue.bold('POST');
    case 'put':
      return chalk.yellow.bold('PUT');
    case 'patch':
      return chalk.magenta.bold('PATCH');
    case 'delete':
      return chalk.red.bold('DELETE');
    default:
      return chalk.white.bold(method.toUpperCase());
  }
}

export function getStatusColor(statusCode: number): string {
  switch (true) {
    case statusCode >= 200 && statusCode < 300:
      return chalk.green.bold(statusCode.toString());
    case statusCode >= 300 && statusCode < 400:
      return chalk.yellow.bold(statusCode.toString());
    case statusCode >= 400 && statusCode < 500:
      return chalk.red.bold(statusCode.toString());
    case statusCode >= 500:
      return chalk.magenta.bold(statusCode.toString());
    default:
      return chalk.white.bold(statusCode.toString());
  }
}

export function getTimestampColor(timestamp: string): string {
  return chalk.gray(`[${timestamp}]`);
}

export function getResponseTimeColor(responseTime: number): string {
  return chalk.magenta(`${responseTime}ms`);
}

export function getTableColor(message: string): string {
  return chalk.white.bold(message);
}

export function getArrowForMethod(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return '→';
    case 'POST':
      return '←';
    case 'PATCH':
    case 'PUT':
      return '←';
    case 'DELETE':
      return '×';
    default:
      return '→';
  }
}
