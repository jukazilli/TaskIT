import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "../styles/tokens.css";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://taskit-azure.vercel.app"),
  title: {
    default: "TaskIT — Planeje sua semana de estudos com clareza",
    template: "%s | TaskIT",
  },
  description:
    "Organize tarefas, projetos e sua semana de estudos em um lugar leve. Capture rápido, planeje com clareza e adapte sua rotina sem sobrecarga.",
  applicationName: "TaskIT",
  keywords: [
    "planejamento de estudos",
    "organização de estudos",
    "agenda de estudos",
    "tarefas",
    "planner semanal",
    "produtividade para estudantes",
  ],
  authors: [{ name: "TaskIT" }],
  creator: "TaskIT",
  publisher: "TaskIT",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "TaskIT",
    title: "TaskIT — Sua semana de estudos, com clareza",
    description:
      "Capture tarefas, organize projetos e planeje uma semana possível — sem transformar organização em mais uma obrigação.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskIT — Sua semana de estudos, com clareza",
    description:
      "Tarefas, projetos e planejamento semanal em um lugar leve para estudantes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={nunito.className}>
      <body>{children}</body>
    </html>
  );
}
