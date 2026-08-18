import { createNeonAuth } from "@neondatabase/auth/next/server";

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new AuthConfigurationError(
      `Required server authentication configuration is missing: ${name}`,
    );
  }

  return value;
}

export function getAuth() {
  if (authInstance) {
    return authInstance;
  }

  const baseUrl = requiredEnvironmentVariable("NEON_AUTH_BASE_URL");
  const cookieSecret = requiredEnvironmentVariable("NEON_AUTH_COOKIE_SECRET");

  if (cookieSecret.length < 32) {
    throw new AuthConfigurationError(
      "NEON_AUTH_COOKIE_SECRET must contain at least 32 characters.",
    );
  }

  authInstance = createNeonAuth({
    baseUrl,
    cookies: {
      secret: cookieSecret,
    },
  });

  return authInstance;
}
