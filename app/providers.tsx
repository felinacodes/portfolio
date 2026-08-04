"use client";

import { ThemeProvider } from "next-themes";
import { SoundProvider } from "@/contexts/SoundContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { NotebookProvider } from "@/contexts/NotebookContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NotebookProvider>
        <SoundProvider>
          <DrawingProvider>{children}</DrawingProvider>
        </SoundProvider>
      </NotebookProvider>
    </ThemeProvider>
  );
}
