import type { NextRequest } from "next/server";

import { getAuth } from "@/server/auth/server";

export const dynamic = "force-dynamic";

type AuthRouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: AuthRouteContext) {
  const { GET: handler } = getAuth().handler();
  return handler(request, context);
}

export async function POST(request: NextRequest, context: AuthRouteContext) {
  const { POST: handler } = getAuth().handler();
  return handler(request, context);
}
