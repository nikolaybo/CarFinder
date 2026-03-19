declare global {
  interface Window {
    __env?: { supabaseUrl: string; supabaseKey: string };
  }
}

export function getRuntimeConfig(): { supabaseUrl: string; supabaseKey: string } {
  // Browser context — credentials were injected by the SSR server into window.__env
  if (typeof window !== 'undefined' && window.__env) {
    return window.__env;
  }
  // Server (SSR) context — read directly from process environment
  return {
    supabaseUrl: process.env['SUPABASE_URL'] ?? '',
    supabaseKey: process.env['SUPABASE_KEY'] ?? '',
  };
}
