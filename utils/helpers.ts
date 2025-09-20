import type { CallerLocation, ResolveCtx } from '../types';

export function getCallerLocation(): CallerLocation {
  const root = `${process.cwd()}/`;
  const err = new Error();
  const stack = (err.stack || '').split('\n');
  
  for (const frame of stack) {
    const match =
      frame.match(/\((.*):(\d+):(\d+)\)/) ||
      frame.match(/at ([^ ]+):(\d+):(\d+)/);
    if (!match) continue;
    
    const filePath = match[1];
    if (!filePath) continue;
    
    if (
      filePath.includes('node:internal') ||
      filePath.includes('node_modules/winston') ||
      filePath.includes('standalone-logger.ts')
    ) {
      continue;
    }
    
    const rel = filePath.startsWith(root)
      ? filePath.slice(root.length)
      : filePath;
    const line = Number(match[2]);
    
    return { file: rel, line: Number.isNaN(line) ? null : line };
  }
  
  return { file: 'src/utils/configs/loggers/standalone-logger.ts', line: null };
}

export function resolveStatusCode(
  ctx: ResolveCtx,
  fallbackIfSuccess = 200,
  fallbackIfError = 500,
  preferError = false
): number {
  const err = ctx?.error;
  const code = ctx?.code || err?.code;
  const errStatus = Number(err?.status ?? err?.statusCode);

  if (preferError && err) {
    if (!Number.isNaN(errStatus) && errStatus > 0) return errStatus;
    if (code === 'NOT_FOUND') return 404;
    return fallbackIfError;
  }

  const explicit = Number(ctx?.set?.status);
  if (!Number.isNaN(explicit) && explicit > 0) return explicit;

  if (err) {
    if (!Number.isNaN(errStatus) && errStatus > 0) return errStatus;
    if (code === 'NOT_FOUND') return 404;
    return fallbackIfError;
  }

  return fallbackIfSuccess;
}

export function createLogDir(runtime: any): string {
  const logDir = runtime.path.join(runtime.cwd(), '.log');
  
  if (!runtime.file.existsSync(logDir)) {
    runtime.file.mkdirSync(logDir, { recursive: true });
    runtime.file.writeFileSync(runtime.path.join(logDir, '.keep'), '');
  }
  
  return logDir;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function shouldLogTable(): boolean {
  return !isProduction();
}
