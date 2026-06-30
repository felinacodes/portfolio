import React from "react";
import { Sun, Moon, Volume2, VolumeX, Sparkles, Pause } from "lucide-react";

type OptionsProps = {
  darkMode: string | undefined;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
};

const Options = ({
  darkMode,
  soundEnabled,
  animationsEnabled,
  toggleDarkMode,
  toggleSound,
  toggleAnimations,
}: OptionsProps) => {
  return (
    <div className="  text-myDark bg-myPink flex flex-col items-center gap-6 py-6 p-2 h-full w-full  border-2 border-gray-200 text-center">
      <div className="flex flex-row flex-wrap  items-center gap-4 justify-evenly w-full content-center ">
        <button
          onClick={toggleDarkMode}
          className="z-1 hover:scale-110 transition-transform cursor-pointer "
          aria-label="Toggle theme"
        >
          {darkMode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={toggleAnimations}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle animations"
        >
          {animationsEnabled ? <Sparkles size={24} /> : <Pause size={24} />}
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={toggleSound}
          className="z-1  hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="text-sm font-medium"></span>
        </button>
      </div>
    </div>
  );
};

export default Options;
