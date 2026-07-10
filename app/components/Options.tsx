import React, { useRef } from "react";

import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  Pause,
  Eraser,
  Highlighter,
  PenOff,
  Pencil,
  PencilOff,
  Minus,
  Pen,
  Trash,
} from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { useDrawing } from "@/contexts/DrawingContext";

type OptionsProps = {
  darkMode: string | undefined;
  animationsEnabled: boolean;
  toggleDarkMode: () => void;
  toggleAnimations: () => void;
};

const Options = ({
  darkMode,
  animationsEnabled,
  toggleDarkMode,
  toggleAnimations,
}: OptionsProps) => {
  const { play, soundEnabled, toggleSound } = useSound();
  const {
    drawingEnabled,
    activeTool,
    selectTool,
    disableDrawing,
    activeColor,
    setActiveColor,
    clearAllDrawings,
  } = useDrawing();

  const playSound = () => {
    play("click");
  };
  const colorInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="  text-myDark bg-myPink flex flex-col items-center gap-6 py-6 p-2 h-full w-full  border-2 border-gray-200 text-center">
      <div className="relative flex flex-row flex-wrap  items-center gap-4 justify-evenly w-full content-center ">
        <button
          onClick={() => {
            playSound();
            toggleDarkMode();
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer "
          aria-label="Toggle theme"
        >
          {darkMode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => {
            playSound();
            toggleAnimations();
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle animations"
        >
          {animationsEnabled ? <Sparkles size={24} /> : <Pause size={24} />}
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => {
            playSound();
            toggleSound();
          }}
          className="z-1  hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => {
            playSound();

            if (activeTool === "highlighter") {
              disableDrawing();
            } else {
              selectTool("highlighter");
            }
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle drawing"
        >
          <Highlighter
            size={24}
            color={activeTool === "highlighter" ? "red" : "black"}
          />
          <span className={`text-sm font-medium `}></span>
        </button>

        <button
          onClick={() => {
            playSound();

            if (activeTool === "pencil") {
              disableDrawing();
            } else {
              selectTool("pencil");
            }
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle drawing"
        >
          <Pencil size={24} color={activeTool === "pencil" ? "red" : "black"} />

          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => {
            playSound();

            if (activeTool === "pen") {
              disableDrawing();
            } else {
              selectTool("pen");
            }
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle drawing"
        >
          <Pen size={24} color={activeTool === "pen" ? "red" : "black"} />
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => {
            playSound();

            if (activeTool === "eraser") {
              disableDrawing();
            } else {
              selectTool("eraser");
            }
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle eraser"
        >
          <Eraser size={24} color={activeTool === "eraser" ? "red" : "black"} />
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => {
            playSound();
            clearAllDrawings();
          }}
          className="z-1 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle eraser"
        >
          <Trash size={24} />
          <span className="text-sm font-medium"></span>
        </button>

        <button
          onClick={() => colorInputRef.current?.click()}
          className="z-1 relative"
        >
          <div
            className=" w-5 h-5 rounded-full border cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: activeColor }}
          />
        </button>

        <input
          ref={colorInputRef}
          onClick={() => {
            playSound();
          }}
          type="color"
          value={activeColor}
          onChange={(e) => setActiveColor(e.target.value)}
          className="opacity-0 absolute top-10 left-0 "
        />
      </div>
    </div>
  );
};

export default Options;
