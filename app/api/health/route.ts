import { NextResponse } from "next/server";

import { hasSupabaseAdminConfig } from "@/lib/bdms/supabase-admin";
import { hasEnvVars } from "@/lib/utils";

export function GET() {
  return NextResponse.json({
    status: "ok",
    app: "BDMS",
    supabasePublicEnv: Boolean(hasEnvVars),
    supabaseAdminEnv: hasSupabaseAdminConfig(),
  });
}

