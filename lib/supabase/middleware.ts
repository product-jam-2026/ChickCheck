import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_ENABLED,
} from "@/lib/config";

type MiddlewareClientResult = {
  supabase: SupabaseClient | null;
  response: NextResponse;
};

export const createClient = (request: NextRequest): MiddlewareClientResult => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!SUPABASE_ENABLED) {
    return { supabase: null, response };
  }

  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const safeOptions = options ?? {};
          try {
            request.cookies.set({ name, value, ...safeOptions });
          } catch {
            // In middleware this shouldn't fail often, but avoid blocking auth.
          }
          response.cookies.set({ name, value, ...safeOptions });
        },
        remove(name: string, options: CookieOptions) {
          const safeOptions = options ?? {};
          try {
            request.cookies.set({ name, value: "", ...safeOptions });
          } catch {
            // In middleware this shouldn't fail often, but avoid blocking auth.
          }
          response.cookies.set({ name, value: "", ...safeOptions });
        },
      },
    }
  );

  return { supabase, response };
};
