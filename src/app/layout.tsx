import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TaskIT",
  description: "Planejamento de estudos com clareza, calma e foco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
