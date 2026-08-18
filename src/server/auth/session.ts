import { AuthConfigurationError, getAuth } from "./server";

export type AuthSession = Readonly<{
  subject: string;
  email: string | null;
  name: string | null;
}>;

export class AuthServiceUnavailableError extends Error {
  constructor() {
    super("Authentication service is temporarily unavailable.");
    this.name = "AuthServiceUnavailableError";
  }
}

export async function getCurrentAuthSession(): Promise<AuthSession | null> {
  try {
    const { data, error } = await getAuth().getSession();

    if (error) {
      throw new AuthServiceUnavailableError();
    }

    if (!data?.user) {
      return null;
    }

    return {
      subject: data.user.id,
      email: data.user.email ?? null,
      name: data.user.name ?? null,
    };
  } catch (error) {
    if (
      error instanceof AuthConfigurationError ||
      error instanceof AuthServiceUnavailableError
    ) {
      throw error;
    }

    throw new AuthServiceUnavailableError();
  }
}
