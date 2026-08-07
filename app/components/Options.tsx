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
import { motion } from "framer-motion";

type OptionsProps = {
  darkMode: string | undefined;
  animationsEnabled: boolean;
  toggleDarkMode: () => void;
  toggleAnimations: () => void;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.025,
    },
  },
};

const optionItemVariants = {
  hidden: {
    opacity: 0,
    // x: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    // x: 0,
    scale: 1,
    transition: {
      duration: 0.05,
      ease: "easeInOut" as const,
    },
  },
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
    <div className="text-myDark bg-myPink flex flex-col items-center gap-6 py-6 p-2 h-full w-full  border-2 border-gray-200 text-center">
      <motion.div
        className="
        relative
        grid
        grid-cols-[repeat(auto-fit,minmax(20px,1fr))]
        gap-4
        items-center
        justify-items-center
        w-full
        content-center
        md:grid-cols-3
        md:gap-8
        p-2
          "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          variants={optionItemVariants}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();
            toggleDarkMode();
          }}
          className="z-1 cursor-pointer "
          aria-label="Toggle theme"
        >
          {darkMode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();
            toggleAnimations();
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle animations"
        >
          {animationsEnabled ? <Sparkles size={24} /> : <Pause size={24} />}
          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();
            toggleSound();
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          animate={{
            scale: activeTool === "highlighter" ? 1.2 : 1,
            rotate: activeTool === "highlighter" ? -10 : 0,
          }}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();

            if (activeTool === "highlighter") {
              disableDrawing();
            } else {
              selectTool("highlighter");
            }
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle drawing"
        >
          <Highlighter
            size={24}
            color={activeTool === "highlighter" ? "#666262" : "black"}
          />
          <span className={`text-sm font-medium `}></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          animate={{
            scale: activeTool === "pencil" ? 1.2 : 1,
            rotate: activeTool === "pencil" ? -10 : 0,
          }}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();

            if (activeTool === "pencil") {
              disableDrawing();
            } else {
              selectTool("pencil");
            }
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle drawing"
        >
          <Pencil
            size={24}
            color={activeTool === "pencil" ? "#666262" : "black"}
          />

          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          animate={{
            scale: activeTool === "pen" ? 1.2 : 1,
            rotate: activeTool === "pen" ? -10 : 0,
          }}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();

            if (activeTool === "pen") {
              disableDrawing();
            } else {
              selectTool("pen");
            }
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle drawing"
        >
          <Pen size={24} color={activeTool === "pen" ? "#666262" : "black"} />
          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          animate={{
            scale: activeTool === "eraser" ? 1.2 : 1,
            rotate: activeTool === "eraser" ? -10 : 0,
          }}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();

            if (activeTool === "eraser") {
              disableDrawing();
            } else {
              selectTool("eraser");
            }
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle eraser"
        >
          <Eraser
            size={24}
            color={activeTool === "eraser" ? "#666262" : "black"}
          />
          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => {
            playSound();
            clearAllDrawings();
          }}
          className="z-1 cursor-pointer"
          aria-label="Toggle eraser"
        >
          <Trash size={24} />
          <span className="text-sm font-medium"></span>
        </motion.button>

        <motion.button
          variants={optionItemVariants}
          whileHover={{
            scale: 1.12,
            y: -2,
            transition: {
              duration: 0.1,
              ease: "easeInOut",
            },
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
          }}
          onClick={() => colorInputRef.current?.click()}
          className="z-1 relative"
        >
          <div
            className=" w-5 h-5 rounded-full border cursor-pointer "
            style={{ backgroundColor: activeColor }}
          />
        </motion.button>

        <motion.input
          ref={colorInputRef}
          onClick={() => {
            playSound();
          }}
          type="color"
          value={activeColor}
          onChange={(e) => setActiveColor(e.target.value)}
          className="opacity-0 absolute top-10 left-0 "
        />
      </motion.div>
    </div>
  );
};

export default Options;
