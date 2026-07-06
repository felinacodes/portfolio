"use client";

import { ThemeProvider } from "next-themes";
import { SoundProvider } from "@/contexts/SoundContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SoundProvider>{children}</SoundProvider>
    </ThemeProvider>
  );
}
