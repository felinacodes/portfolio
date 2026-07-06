import { createContext, useContext, ReactNode, useState } from "react";
import { getSound, SoundName } from "@/lib/sounds";

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  play: (sound: SoundName) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const play = (sound: SoundName) => {
    if (!soundEnabled) return;

    const audio = getSound(sound);

    audio.currentTime = 0;
    audio.play().catch();
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
}
