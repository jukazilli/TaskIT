import { getSql } from "@/server/db/client";

export const dynamic = "force-dynamic";

type DatabaseHealthRow = Readonly<{
  branch_id: string | null;
  endpoint_id: string | null;
  schema_ready: boolean;
}>;

type DatabaseHealth = Readonly<{
  reachable: boolean;
  branchId: string | null;
  endpointId: string | null;
  schemaReady: boolean;
}>;

function isConfigured(value: string | undefined) {
  return Boolean(value?.trim());
}

function readAuthEndpointId(value: string | undefined) {
  if (!isConfigured(value)) {
    return null;
  }

  try {
    const hostname = new URL(value as string).hostname;
    return hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

async function inspectDatabase(): Promise<DatabaseHealth> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `SELECT
         current_setting('neon.branch_id', true) AS branch_id,
         current_setting('neon.endpoint_id', true) AS endpoint_id,
         to_regclass('taskit.app_user') IS NOT NULL
           AND to_regclass('taskit.project') IS NOT NULL
           AND to_regclass('taskit.task') IS NOT NULL AS schema_ready`,
    )) as unknown as DatabaseHealthRow[];
    const row = rows[0];

    return {
      reachable: Boolean(row),
      branchId: row?.branch_id ?? null,
      endpointId: row?.endpoint_id ?? null,
      schemaReady: row?.schema_ready === true,
    };
  } catch {
    return {
      reachable: false,
      branchId: null,
      endpointId: null,
      schemaReady: false,
    };
  }
}

export async function GET() {
  const runningOnVercel = process.env.VERCEL === "1";
  const authConfigured =
    isConfigured(process.env.NEON_AUTH_BASE_URL) &&
    isConfigured(process.env.NEON_AUTH_COOKIE_SECRET);
  const authEndpointId = readAuthEndpointId(process.env.NEON_AUTH_BASE_URL);
  const databaseConfigured = isConfigured(process.env.DATABASE_URL);
  const databaseHealth = databaseConfigured
    ? await inspectDatabase()
    : {
        reachable: false,
        branchId: null,
        endpointId: null,
        schemaReady: false,
      };
  const authDatabaseAligned =
    authConfigured &&
    Boolean(authEndpointId) &&
    databaseHealth.reachable &&
    databaseHealth.endpointId === authEndpointId;
  const release = process.env.VERCEL_GIT_COMMIT_SHA?.trim() || "local";
  const environment = process.env.VERCEL_ENV?.trim() || "local";
  const ready =
    !runningOnVercel ||
    (authConfigured &&
      databaseConfigured &&
      databaseHealth.reachable &&
      databaseHealth.schemaReady &&
      authDatabaseAligned);

  return Response.json(
    {
      status: ready ? "ok" : "degraded",
      service: "taskit",
      release,
      environment,
      databaseBranch: databaseHealth.branchId,
      checks: {
        auth: authConfigured,
        database: databaseConfigured && databaseHealth.reachable,
        schema: databaseHealth.schemaReady,
        authDatabaseAligned,
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
