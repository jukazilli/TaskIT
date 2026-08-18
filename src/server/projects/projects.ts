import type {
  ProjectColorKey,
  ProjectIconKey,
  ProjectStatus,
} from "@/features/projects/project-options";
import {
  DatabaseConfigurationError,
  DatabaseUnavailableError,
  getSql,
} from "@/server/db/client";
import type { ProjectInput } from "@/server/projects/project-input";

export type Project = Readonly<{
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  dueDate: string | null;
  colorKey: ProjectColorKey;
  iconKey: ProjectIconKey;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}>;

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  due_date: string | null;
  color_key: ProjectColorKey;
  icon_key: ProjectIconKey;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export class ProjectNotFoundError extends Error {
  constructor() {
    super("Project was not found for the authenticated user.");
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectUserMissingError extends Error {
  constructor() {
    super("TaskIT user identity is missing for the authenticated subject.");
    this.name = "ProjectUserMissingError";
  }
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    colorKey: row.color_key,
    iconKey: row.icon_key,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rethrowDatabaseError(error: unknown): never {
  if (
    error instanceof DatabaseConfigurationError ||
    error instanceof ProjectNotFoundError ||
    error instanceof ProjectUserMissingError
  ) {
    throw error;
  }

  throw new DatabaseUnavailableError();
}

const projectColumns = `
  project.id::text,
  project.name,
  project.description,
  project.status,
  project.due_date::text,
  project.color_key,
  project.icon_key,
  project.archived_at::text,
  project.created_at::text,
  project.updated_at::text
`;

export async function listProjects(
  authSubject: string,
  options: Readonly<{ archived?: boolean }> = {},
): Promise<readonly Project[]> {
  try {
    const sql = getSql();
    const archived = Boolean(options.archived);
    const rows = (await sql.query(
      `SELECT ${projectColumns}
       FROM taskit.project AS project
       INNER JOIN taskit.app_user AS app_user ON app_user.id = project.user_id
       WHERE app_user.auth_subject = $1::uuid
         AND (($2::boolean = false AND project.archived_at IS NULL)
           OR ($2::boolean = true AND project.archived_at IS NOT NULL))
       ORDER BY
         CASE project.status
           WHEN 'active' THEN 0
           WHEN 'paused' THEN 1
           WHEN 'completed' THEN 2
           ELSE 3
         END,
         project.due_date ASC NULLS LAST,
         project.updated_at DESC`,
      [authSubject, archived],
    )) as unknown as ProjectRow[];

    return rows.map(toProject);
  } catch (error) {
    rethrowDatabaseError(error);
  }
}

export async function getProject(
  authSubject: string,
  projectId: string,
): Promise<Project> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `SELECT ${projectColumns}
       FROM taskit.project AS project
       INNER JOIN taskit.app_user AS app_user ON app_user.id = project.user_id
       WHERE app_user.auth_subject = $1::uuid
         AND project.id = $2::uuid
         AND project.archived_at IS NULL
       LIMIT 1`,
      [authSubject, projectId],
    )) as unknown as ProjectRow[];

    const row = rows[0];

    if (!row) {
      throw new ProjectNotFoundError();
    }

    return toProject(row);
  } catch (error) {
    rethrowDatabaseError(error);
  }
}

export async function createProject(
  authSubject: string,
  input: ProjectInput,
): Promise<Project> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `INSERT INTO taskit.project (
         user_id,
         name,
         description,
         status,
         due_date,
         color_key,
         icon_key
       )
       SELECT
         app_user.id,
         $2,
         $3,
         $4,
         $5::date,
         $6,
         $7
       FROM taskit.app_user AS app_user
       WHERE app_user.auth_subject = $1::uuid
       RETURNING ${projectColumns.replaceAll("project.", "")}`,
      [
        authSubject,
        input.name,
        input.description,
        input.status,
        input.dueDate,
        input.colorKey,
        input.iconKey,
      ],
    )) as unknown as ProjectRow[];

    const row = rows[0];

    if (!row) {
      throw new ProjectUserMissingError();
    }

    return toProject(row);
  } catch (error) {
    rethrowDatabaseError(error);
  }
}

export async function updateProject(
  authSubject: string,
  projectId: string,
  input: ProjectInput,
): Promise<Project> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `UPDATE taskit.project AS project
       SET name = $3,
           description = $4,
           status = $5,
           due_date = $6::date,
           color_key = $7,
           icon_key = $8,
           updated_at = now()
       FROM taskit.app_user AS app_user
       WHERE project.user_id = app_user.id
         AND app_user.auth_subject = $1::uuid
         AND project.id = $2::uuid
         AND project.archived_at IS NULL
       RETURNING ${projectColumns}`,
      [
        authSubject,
        projectId,
        input.name,
        input.description,
        input.status,
        input.dueDate,
        input.colorKey,
        input.iconKey,
      ],
    )) as unknown as ProjectRow[];

    const row = rows[0];

    if (!row) {
      throw new ProjectNotFoundError();
    }

    return toProject(row);
  } catch (error) {
    rethrowDatabaseError(error);
  }
}

export async function archiveProject(
  authSubject: string,
  projectId: string,
): Promise<void> {
  try {
    const sql = getSql();
    const rows = (await sql.query(
      `UPDATE taskit.project AS project
       SET archived_at = COALESCE(project.archived_at, now()),
           updated_at = now()
       FROM taskit.app_user AS app_user
       WHERE project.user_id = app_user.id
         AND app_user.auth_subject = $1::uuid
         AND project.id = $2::uuid
       RETURNING project.id::text`,
      [authSubject, projectId],
    )) as unknown as Array<{ id: string }>;

    if (!rows[0]) {
      throw new ProjectNotFoundError();
    }
  } catch (error) {
    rethrowDatabaseError(error);
  }
}
