import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "../styles/tokens.css";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
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
    <html lang="pt-BR" className={nunito.className}>
      <body>{children}</body>
    </html>
  );
}
