import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
  getSql,
} from "@/server/db/client";
import type { QuickAddInput } from "@/server/tasks/task-input";

export type InboxTask = Readonly<{
  id: string;
  title: string;
  createdAt: string;
}>;

type InboxTaskRow = {
  id: string;
  title: string;
  created_at: string;
};

export class TaskUserMissingError extends Error {
  constructor() {
    super("TaskIT user identity is missing for the authenticated subject.");
    this.name = "TaskUserMissingError";
  }
}

function rethrowDatabaseError(error: unknown): never {
  if (
    error instanceof DatabaseConfigurationError ||
    error instanceof TaskUserMissingError
  ) {
    throw error;
  }

  throw new DatabaseUnavailableError();
}

function toInboxTask(row: InboxTaskRow): InboxTask {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  };
}

export async function listInboxTasks(
  authSubject: string,
): Promise<readonly InboxTask[]> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `SELECT
         task.id::text,
         task.title,
         task.created_at::text
       FROM taskit.task AS task
       INNER JOIN taskit.app_user AS app_user ON app_user.id = task.user_id
       WHERE app_user.auth_subject = $1::uuid
         AND task.status = 'inbox'
       ORDER BY task.created_at DESC`,
      [authSubject],
    )) as unknown as InboxTaskRow[];

    return rows.map(toInboxTask);
  } catch (error) {
    rethrowDatabaseError(error);
  }
}

export async function createInboxTask(
  authSubject: string,
  input: QuickAddInput,
): Promise<InboxTask> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `INSERT INTO taskit.task (user_id, title, status)
       SELECT app_user.id, $2, 'inbox'
       FROM taskit.app_user AS app_user
       WHERE app_user.auth_subject = $1::uuid
       RETURNING id::text, title, created_at::text`,
      [authSubject, input.title],
    )) as unknown as InboxTaskRow[];

    const row = rows[0];

    if (!row) {
      throw new TaskUserMissingError();
    }

    return toInboxTask(row);
  } catch (error) {
    rethrowDatabaseError(error);
  }
}
