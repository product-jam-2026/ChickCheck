"use client";

import { useEffect, useState } from "react";
import { SUPABASE_ENABLED } from "@/lib/config";

export default function DebugEnv() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseEnabled: boolean;
    hasUrl: boolean;
    hasAnonKey: boolean;
    hasServiceKey: boolean;
  } | null>(null);

  useEffect(() => {
    setEnvStatus({
      supabaseEnabled: SUPABASE_ENABLED,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // Note: using anon key as service key in config
    });
  }, []);

  if (!envStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Environment Configuration Debug</h1>
      <div style={{ marginTop: "1rem" }}>
        <p>
          <strong>Supabase Enabled:</strong> {envStatus.supabaseEnabled ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Has SUPABASE_URL:</strong> {envStatus.hasUrl ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Has SUPABASE_ANON_KEY:</strong> {envStatus.hasAnonKey ? "✅ Yes" : "❌ No"}
        </p>
        <p>
          <strong>Has SERVICE_KEY:</strong> {envStatus.hasServiceKey ? "✅ Yes" : "❌ No"}
        </p>
      </div>
      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f0f0f0" }}>
        <h2>What to check:</h2>
        <ul>
          <li>If Supabase is enabled but you see redirect loops, your Supabase credentials might be invalid</li>
          <li>If Supabase is disabled, the site should work without authentication</li>
          <li>Make sure your `.env.local` file has valid values (not empty strings)</li>
        </ul>
      </div>
    </div>
  );
}

