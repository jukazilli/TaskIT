export const dynamic = "force-dynamic";

function isConfigured(value: string | undefined) {
  return Boolean(value?.trim());
}

export async function GET() {
  const runningOnVercel = process.env.VERCEL === "1";
  const authConfigured =
    isConfigured(process.env.NEON_AUTH_BASE_URL) &&
    isConfigured(process.env.NEON_AUTH_COOKIE_SECRET);
  const databaseConfigured = isConfigured(process.env.DATABASE_URL);
  const release = process.env.VERCEL_GIT_COMMIT_SHA?.trim() || "local";
  const environment = process.env.VERCEL_ENV?.trim() || "local";
  const ready = !runningOnVercel || (authConfigured && databaseConfigured);

  return Response.json(
    {
      status: ready ? "ok" : "degraded",
      service: "taskit",
      release,
      environment,
      checks: {
        auth: authConfigured,
        database: databaseConfigured,
      },
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
