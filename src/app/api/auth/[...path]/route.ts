import type { NextRequest } from "next/server";

import { getAuth } from "@/server/auth/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { GET: handler } = getAuth().handler();
  return handler(request);
}

export async function POST(request: NextRequest) {
  const { POST: handler } = getAuth().handler();
  return handler(request);
}
