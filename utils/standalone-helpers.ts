import type { CallerLocation } from '../types/standalone.types';

export function getCallerLocation(): CallerLocation {
  const root = `${process.cwd()}/`;
  const err = new Error();
  const stack = (err.stack || '').split('\n');
  
  for (let i = 3; i < stack.length; i++) {
    const frame = stack[i];
    if (!frame) continue;
    
    const match =
      frame.match(/\((.*):(\d+):(\d+)\)/) ||
      frame.match(/at ([^ ]+):(\d+):(\d+)/);
    if (!match) continue;
    
    const filePath = match[1];
    if (!filePath) continue;
    
    if (
      filePath.includes('node:internal') ||
      filePath.includes('node_modules/winston') ||
      filePath.includes('node_modules/tsuki-logger') ||
      filePath.includes('standalone-logger.ts') ||
      filePath.includes('dist/index.js') ||
      filePath.includes('dist/index.mjs')
    ) {
      continue;
    }
    
    const rel = filePath.startsWith(root)
      ? filePath.slice(root.length)
      : filePath;
    const line = Number(match[2]);
    
    return { file: rel, line: Number.isNaN(line) ? null : line };
  }
  
  return { file: 'unknown', line: null };
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function shouldLogTable(): boolean {
  return !isProduction();
}
