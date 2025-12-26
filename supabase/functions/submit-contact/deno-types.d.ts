declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export interface ResponseInit {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
  }

  export interface RequestEvent {
    request: Request;
    respondWith(response: Response | Promise<Response>): Promise<void>;
  }

  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
  export function serve(handler: (req: Request) => Response | Promise<Response>, options: any): void;
}

declare var Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

declare namespace Deno {
  export interface ServeOptions {
    hostname?: string;
    port?: number;
    signal?: AbortSignal;
    onListen?: (params: { hostname: string; port: number }) => void;
  }

  export interface ServeTcpOptions extends ServeOptions {
    hostname?: string;
    port?: number;
    alpnProtocols?: string[];
  }
}
