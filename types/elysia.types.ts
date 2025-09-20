import type { Context } from 'elysia';

export interface ElysiaContext extends Omit<Context, 'set' | 'path'> {
  startTime?: number;
  request: Request;
  path: string;
  set: { 
    status?: number | string;
    headers?: Record<string, string>;
    redirect?: string;
    cookie?: Record<string, any>;
  };
  error?: { 
    status?: number; 
    statusCode?: number; 
    code?: string;
    message?: string;
    stack?: string;
  };
  code?: string;
}

export interface ResolveCtx {
  set?: { status?: number | string };
  error?: { 
    status?: number; 
    statusCode?: number; 
    code?: string;
  };
  code?: string;
}

export interface HttpRequestLog {
  type: 'http_request' | 'http_error';
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  error?: string;
  stack?: string;
  [key: string]: unknown;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ArrowMapping {
  [key: string]: string;
}
