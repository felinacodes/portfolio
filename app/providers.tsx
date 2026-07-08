"use client";

import { ThemeProvider } from "next-themes";
import { SoundProvider } from "@/contexts/SoundContext";
import { DrawingProvider } from "@/contexts/DrawingContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SoundProvider>
        <DrawingProvider>{children}</DrawingProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
