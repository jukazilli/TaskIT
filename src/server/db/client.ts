import { neon } from "@neondatabase/serverless";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL is not configured for this environment.");
    this.name = "DatabaseConfigurationError";
  }
}

export class DatabaseUnavailableError extends Error {
  constructor() {
    super("Database is temporarily unavailable.");
    this.name = "DatabaseUnavailableError";
  }
}

let cachedSql: ReturnType<typeof neon> | undefined;
let cachedDatabaseUrl: string | undefined;

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new DatabaseConfigurationError();
  }

  if (!cachedSql || cachedDatabaseUrl !== databaseUrl) {
    cachedSql = neon(databaseUrl);
    cachedDatabaseUrl = databaseUrl;
  }

  return cachedSql;
}
