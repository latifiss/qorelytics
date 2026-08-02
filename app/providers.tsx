"use client";

import { ThemeProvider } from "@/context/themeContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}