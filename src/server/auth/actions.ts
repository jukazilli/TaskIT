"use server";

import { redirect } from "next/navigation";

import { getAuth } from "./server";

const LOGIN_PATH = "/login";
const DEFAULT_RETURN_PATH = "/app";

function readField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeReturnPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_RETURN_PATH;
  }

  return value;
}

function loginErrorPath(code: string, returnTo: string, mode?: "signup") {
  const params = new URLSearchParams({ error: code, returnTo });

  if (mode) {
    params.set("mode", mode);
  }

  return `${LOGIN_PATH}?${params.toString()}`;
}

function diagnosticValue(value: unknown) {
  return typeof value === "string" || typeof value === "number"
    ? value
    : undefined;
}

function authFailureDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return { kind: typeof error };
  }

  const record = error as Record<string, unknown>;

  return {
    name: diagnosticValue(record.name),
    code: diagnosticValue(record.code),
    status: diagnosticValue(record.status),
    statusCode: diagnosticValue(record.statusCode),
  };
}

function logAuthFailure(operation: string, error: unknown) {
  console.error("TaskIT authentication failure", {
    operation,
    ...authFailureDetails(error),
  });
}

export async function signInAction(formData: FormData) {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const returnTo = safeReturnPath(readField(formData, "returnTo"));

  if (!email || !password) {
    redirect(loginErrorPath("missing-fields", returnTo));
  }

  let result;

  try {
    result = await getAuth().signIn.email({ email, password });
  } catch (error) {
    logAuthFailure("sign-in-email-request", error);
    redirect(loginErrorPath("unavailable", returnTo));
  }

  if (result.error) {
    logAuthFailure("sign-in-email-result", result.error);
    redirect(loginErrorPath("invalid-credentials", returnTo));
  }

  redirect(returnTo);
}

export async function signUpAction(formData: FormData) {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const returnTo = safeReturnPath(readField(formData, "returnTo"));

  if (!name || !email || password.length < 8) {
    redirect(loginErrorPath("invalid-signup", returnTo, "signup"));
  }

  let result;

  try {
    result = await getAuth().signUp.email({ name, email, password });
  } catch (error) {
    logAuthFailure("sign-up-email-request", error);
    redirect(loginErrorPath("unavailable", returnTo, "signup"));
  }

  if (result.error) {
    logAuthFailure("sign-up-email-result", result.error);
    redirect(loginErrorPath("signup-failed", returnTo, "signup"));
  }

  redirect(returnTo);
}

export async function signOutAction() {
  try {
    await getAuth().signOut();
  } catch (error) {
    logAuthFailure("sign-out-request", error);
    redirect("/app?authError=signout");
  }

  redirect(LOGIN_PATH);
}
