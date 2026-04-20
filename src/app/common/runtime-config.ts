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
  // Server (SSR/Node) context — read directly from process environment.
  // Guard required: `process` does not exist in browser or Karma test environments.
  const env = typeof process !== 'undefined' ? process.env : {};
  return {
    supabaseUrl: env['SUPABASE_URL'] ?? '',
    supabaseKey: env['SUPABASE_KEY'] ?? '',
  };
}
