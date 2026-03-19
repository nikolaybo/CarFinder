import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getRuntimeConfig } from '../../common/runtime-config';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly client: SupabaseClient;

  constructor() {
    const { supabaseUrl, supabaseKey } = getRuntimeConfig();
    this.client = createClient(supabaseUrl, supabaseKey, {
      global: { fetch: fetch.bind(globalThis) },
      auth: {
        persistSession:     this.isBrowser,
        autoRefreshToken:   this.isBrowser,
        detectSessionInUrl: this.isBrowser,
      },
    });
  }
}
