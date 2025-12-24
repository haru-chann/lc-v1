// Type declarations for Deno globals
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
  }
  
  export const env: Env;
  
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

// Type declarations for Supabase modules
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export interface SupabaseClient {
    from: (table: string) => SupabaseQueryBuilder;
    auth: {
      persistSession: boolean;
      autoRefreshToken: boolean;
    };
  }
  
  export interface SupabaseQueryBuilder {
    select: (columns?: string, options?: { count?: 'exact'; head?: boolean }) => SupabaseQueryBuilder;
    insert: (data: any, options?: any) => Promise<SupabaseQueryResult>;
    eq: (column: string, value: any) => SupabaseQueryBuilder;
    gte: (column: string, value: any) => SupabaseQueryBuilder;
    // Add execution method that returns the promise
    then: <TResult = SupabaseQueryResult>(
      onfulfilled?: ((value: SupabaseQueryResult) => TResult | PromiseLike<TResult>) | null,
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
    ) => Promise<TResult>;
  }
  
  export interface SupabaseQueryResult {
    data?: any;
    error?: any;
    count?: number | null;
  }
  
  export function createClient(url: string, key: string, options?: any): SupabaseClient;
}
