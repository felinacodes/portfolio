import { createContext, useContext, ReactNode, useState, useRef } from "react";
import { getSound, SoundName } from "@/lib/sounds";

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  play: (sound: SoundName) => void;
  startLoop: (sound: SoundName) => void;
  stopLoop: () => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const currentLoop = useRef<HTMLAudioElement | null>(null);

  const SOUND_VOLUMES = {
    close: 0.4,
    open: 0.4,
    flip: 0.35,
    flipAll: 0.4,
    click: 0.3,
    error: 0.25,
    pen: 0.06,
    pencil: 0.1,
    highlighter: 0.2,
    eraser: 0.6,
  } as const;

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const play = (sound: SoundName) => {
    if (!soundEnabled) return;

    const audio = getSound(sound);

    audio.currentTime = 0;
    audio.volume = SOUND_VOLUMES[sound];

    audio.play().catch();
  };

  const startLoop = (sound: SoundName) => {
    if (!soundEnabled) return;

    const audio = getSound(sound);

    audio.loop = true;
    audio.currentTime = 0;
    audio.volume = SOUND_VOLUMES[sound];

    currentLoop.current = audio;

    audio.play().catch(() => {});
  };

  const stopLoop = () => {
    if (!currentLoop.current) return;

    currentLoop.current.pause();
    currentLoop.current.currentTime = 0;
    currentLoop.current = null;
  };

  return (
    <SoundContext.Provider
      value={{ soundEnabled, toggleSound, play, startLoop, stopLoop }}
    >
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
