import Link from "next/link";
import { redirect } from "next/navigation";

import { ProjectForm } from "@/components/projects/project-form";
import { ProjectMark } from "@/components/projects/project-mark";
import { projectStatusLabels } from "@/features/projects/project-options";
import { archiveProjectAction } from "@/server/projects/actions";
import {
  ProjectNotFoundError,
  getProject,
  listProjects,
  type Project,
} from "@/server/projects/projects";
import { getCurrentAuthSession } from "@/server/auth/session";

import styles from "./page.module.css";

type ProjectsPageProps = Readonly<{
  searchParams: Promise<{
    edit?: string;
    error?: string;
    mode?: string;
    view?: string;
  }>;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatArchiveDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ProjectCard({
  project,
  archived,
}: Readonly<{ project: Project; archived: boolean }>) {
  return (
    <article className={styles.projectCard} data-color={project.colorKey}>
      <div className={styles.projectHeading}>
        <ProjectMark className={styles.projectMark} iconKey={project.iconKey} />
        <div className={styles.projectTitleGroup}>
          <h2>{project.name}</h2>
          <p className={styles.meta}>
            <span className={styles.status} data-status={project.status}>
              {projectStatusLabels[project.status]}
            </span>
            {project.dueDate ? (
              <span>Prazo {formatDate(project.dueDate)}</span>
            ) : null}
            {archived && project.archivedAt ? (
              <span>Arquivado {formatArchiveDate(project.archivedAt)}</span>
            ) : null}
          </p>
        </div>
      </div>

      {project.description ? (
        <p className={styles.description}>{project.description}</p>
      ) : null}

      {!archived ? (
        <div className={styles.cardActions}>
          <Link href={`/app/projects?edit=${project.id}`}>Editar</Link>
          <form action={archiveProjectAction}>
            <input name="projectId" type="hidden" value={project.id} />
            <button type="submit">Arquivar</button>
          </form>
        </div>
      ) : null}
    </article>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const session = await getCurrentAuthSession();

  if (!session) {
    redirect("/login?returnTo=%2Fapp%2Fprojects");
  }

  const archived = params.view === "archived";
  const projects = await listProjects(session.subject, { archived });
  const wantsCreate = !archived && params.mode === "create";
  let editingProject: Project | undefined;
  let editorError: string | undefined;

  if (!archived && params.edit) {
    if (!UUID_PATTERN.test(params.edit)) {
      editorError = "O projeto solicitado não está disponível.";
    } else {
      try {
        editingProject = await getProject(session.subject, params.edit);
      } catch (error) {
        if (error instanceof ProjectNotFoundError) {
          editorError = "O projeto solicitado não está disponível.";
        } else {
          throw error;
        }
      }
    }
  }

  const showEditor =
    wantsCreate || Boolean(editingProject) || Boolean(editorError);

  return (
    <section className={styles.page} aria-labelledby="projects-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Projetos</p>
          <h1 id="projects-title">Organize o que tem propósito.</h1>
          <p className={styles.intro}>
            Cada projeto representa um resultado relevante. Mantenha o contexto
            curto e deixe tarefas e sessões carregarem os detalhes do trabalho.
          </p>
        </div>
        <Link className={styles.primaryAction} href="/app/projects?mode=create">
          Novo projeto
        </Link>
      </header>

      {params.error === "archive-failed" ? (
        <p className={styles.pageError} role="alert">
          Não foi possível arquivar o projeto agora. Tente novamente.
        </p>
      ) : null}

      <nav className={styles.viewNav} aria-label="Visualização de projetos">
        <Link
          aria-current={!archived ? "page" : undefined}
          href="/app/projects"
        >
          Ativos
        </Link>
        <Link
          aria-current={archived ? "page" : undefined}
          href="/app/projects?view=archived"
        >
          Arquivados
        </Link>
      </nav>

      <div className={styles.workspace} data-editor={showEditor || undefined}>
        <div className={styles.listColumn}>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyMark} aria-hidden="true" />
              <div>
                <h2>
                  {archived
                    ? "Nenhum projeto arquivado."
                    : "Seu primeiro projeto começa aqui."}
                </h2>
                <p>
                  {archived
                    ? "Projetos arquivados continuam disponíveis para consulta histórica."
                    : "Crie um resultado que valha acompanhar, como uma certificação, disciplina ou meta de idioma."}
                </p>
                {!archived ? (
                  <Link href="/app/projects?mode=create">
                    Criar primeiro projeto
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className={styles.projectList}>
              {projects.map((project) => (
                <ProjectCard
                  archived={archived}
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>

        {showEditor ? (
          <aside
            className={styles.editor}
            aria-labelledby="project-editor-title"
          >
            <div className={styles.editorHeader}>
              <div>
                <p>{editingProject ? "Editar projeto" : "Novo projeto"}</p>
                <h2 id="project-editor-title">
                  {editingProject ? editingProject.name : "Defina o resultado"}
                </h2>
              </div>
              <Link href="/app/projects" aria-label="Fechar editor">
                Fechar
              </Link>
            </div>

            {editorError ? (
              <p className={styles.editorError} role="alert">
                {editorError}
              </p>
            ) : (
              <ProjectForm project={editingProject} />
            )}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
