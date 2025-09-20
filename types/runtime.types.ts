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

export interface BunFileAPI {
  existsSync: (path: string) => boolean;
  mkdirSync: (path: string, options?: { recursive?: boolean }) => void;
  writeFileSync: (path: string, data: string) => void;
}

export interface NodeFileAPI {
  existsSync: (path: string) => boolean;
  mkdirSync: (path: string, options?: { recursive?: boolean }) => void;
  writeFileSync: (path: string, data: string) => void;
}
