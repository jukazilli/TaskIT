"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { signOutAction } from "@/server/auth/actions";

import styles from "./app-shell.module.css";

type IconProps = Readonly<{ className?: string }>;

type NavItem = Readonly<{
  href: string;
  label: string;
  icon: (props: IconProps) => ReactNode;
}>;

function TodayIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8 13h3v3H8z" />
    </svg>
  );
}

function WeekIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

function ProjectsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10l2 2h6.5A1.5 1.5 0 0 1 20 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-12Z" />
    </svg>
  );
}

function TimelineIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5v14M5 8h5M10 8v4h7M17 12v4h2M9 16h8" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="17" cy="12" r="1.5" />
      <circle cx="9" cy="16" r="1.5" />
    </svg>
  );
}

function InboxIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 5h13l2 8v5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-5l2-8Z" />
      <path d="M4 13h5l1.5 2h3L15 13h5" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.7A7 7 0 0 0 7.5 7L5 5.9 3 9.3l2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2.1 1.2L10 21h4l.4-2.7a7 7 0 0 0 2.1-1.2l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
    </svg>
  );
}

function MoreIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}

const primaryNav: readonly NavItem[] = [
  { href: "/app/today", label: "Hoje", icon: TodayIcon },
  { href: "/app/week", label: "Semana", icon: WeekIcon },
  { href: "/app/projects", label: "Projetos", icon: ProjectsIcon },
  { href: "/app/timeline", label: "Cronograma", icon: TimelineIcon },
  { href: "/app/inbox", label: "Inbox", icon: InboxIcon },
];

const mobileNav = primaryNav.filter((item) => item.href !== "/app/timeline");

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, compact = false }: { item: NavItem; compact?: boolean }) {
  const pathname = usePathname();
  const active = isCurrentPath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      className={compact ? styles.mobileNavLink : styles.navLink}
      data-active={active || undefined}
      href={item.href}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={styles.navIcon} />
      <span>{item.label}</span>
    </Link>
  );
}

type AppShellProps = Readonly<{
  children: ReactNode;
  userName: string | null;
  userEmail: string | null;
}>;

export function AppShell({ children, userName, userEmail }: AppShellProps) {
  const displayName = userName?.trim() || userEmail?.trim() || "Sua conta";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Navegação principal">
        <Link className={styles.brand} href="/app/today" aria-label="TaskIT — Hoje">
          <span className={styles.brandMark} aria-hidden="true" />
          <span>TaskIT</span>
        </Link>

        <nav className={styles.desktopNav}>
          {primaryNav.map((item) => (
            <NavLink item={item} key={item.href} />
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink item={{ href: "/app/settings", label: "Configurações", icon: SettingsIcon }} />
          <div className={styles.account}>
            <span className={styles.avatar} aria-hidden="true">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className={styles.accountName} title={displayName}>
              {displayName}
            </span>
          </div>
          <form action={signOutAction}>
            <button className={styles.signOut} type="submit">
              Sair
            </button>
          </form>
        </div>
      </aside>

      <header className={styles.mobileHeader}>
        <Link className={styles.mobileBrand} href="/app/today" aria-label="TaskIT — Hoje">
          <span className={styles.brandMark} aria-hidden="true" />
          <span>TaskIT</span>
        </Link>

        <details className={styles.moreMenu}>
          <summary aria-label="Abrir navegação secundária">
            <MoreIcon className={styles.moreIcon} />
          </summary>
          <div className={styles.morePanel}>
            <Link href="/app/timeline">Cronograma</Link>
            <Link href="/app/settings">Configurações</Link>
            <form action={signOutAction}>
              <button type="submit">Sair</button>
            </form>
          </div>
        </details>
      </header>

      <main className={styles.content}>{children}</main>

      <nav className={styles.mobileNav} aria-label="Navegação principal">
        {mobileNav.map((item) => (
          <NavLink compact item={item} key={item.href} />
        ))}
      </nav>
    </div>
  );
}
