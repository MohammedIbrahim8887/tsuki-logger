// Generic context interface to avoid Elysia type conflicts
export interface ElysiaContext {
  startTime?: number;
  request: Request;
  path: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers: Record<string, string | undefined>;
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
  body?: any;
  cookie?: Record<string, any>;
  [key: string]: any;
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
