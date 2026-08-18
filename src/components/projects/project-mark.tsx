import type { ProjectIconKey } from "@/features/projects/project-options";

type ProjectMarkProps = Readonly<{
  iconKey: ProjectIconKey;
  className?: string;
}>;

export function ProjectMark({ iconKey, className }: ProjectMarkProps) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        {iconKey === "book" ? (
          <>
            <path d="M5 4h5a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H5V4Z" />
            <path d="M19 4h-5a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h5V4Z" />
          </>
        ) : iconKey === "target" ? (
          <>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <path d="m12 12 6-6" />
          </>
        ) : iconKey === "certificate" ? (
          <>
            <rect x="5" y="4" width="14" height="12" rx="2" />
            <path d="m9 20 3-4 3 4M9 9h6M9 12h4" />
          </>
        ) : (
          <path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
        )}
      </svg>
    </span>
  );
}
