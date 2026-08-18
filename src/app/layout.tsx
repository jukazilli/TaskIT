import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "../styles/tokens.css";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

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
      <body className={nunito.variable}>{children}</body>
    </html>
  );
}
