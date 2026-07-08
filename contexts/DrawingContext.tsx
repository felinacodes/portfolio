import { createContext, useContext, ReactNode, useState } from "react";

type DrawingContextType = {
  drawingEnabled: boolean;
  activeTool: Tool | null;
  selectTool: (tool: Tool) => void;
  disableDrawing: () => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
};

type Tool = "pencil" | "highlighter" | "pen" | "eraser";

const DrawingContext = createContext<DrawingContextType | null>(null);

export function DrawingProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [activeColor, setActiveColor] = useState<string>("#ffc9d3");
  const drawingEnabled = activeTool !== null;

  const selectTool = (tool: Tool) => {
    setActiveTool(tool);
  };

  const disableDrawing = () => {
    setActiveTool(null);
  };

  return (
    <DrawingContext.Provider
      value={{
        drawingEnabled: drawingEnabled,
        activeTool,
        selectTool,
        disableDrawing,
        activeColor,
        setActiveColor,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
}

export function useDrawing() {
  const context = useContext(DrawingContext);

  if (!context) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }

  return context;
}
