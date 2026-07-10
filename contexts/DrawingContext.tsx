import { createContext, useContext, ReactNode, useState, useRef } from "react";

type DrawingContextType = {
  drawingEnabled: boolean;
  activeTool: Tool | null;
  selectTool: (tool: Tool) => void;
  disableDrawing: () => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  saveDrawing: (pageId: string, imageData: ImageData) => void;
  getDrawing: (pageId: string) => ImageData | undefined;
  clearAllDrawings: () => void;
  clearVersion: number;
};

type Tool = "pencil" | "highlighter" | "pen" | "eraser";

const DrawingContext = createContext<DrawingContextType | null>(null);

export function DrawingProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [activeColor, setActiveColor] = useState<string>("#ffc9d3");
  const [clearVersion, setClearVersion] = useState(0);
  const drawings = useRef<Map<string, ImageData>>(new Map());

  const drawingEnabled = activeTool !== null;

  const selectTool = (tool: Tool) => {
    setActiveTool(tool);
  };

  const disableDrawing = () => {
    setActiveTool(null);
  };

  const saveDrawing = (pageId: string, imageData: ImageData) => {
    drawings.current.set(pageId, imageData);
  };

  const getDrawing = (pageId: string) => {
    return drawings.current.get(pageId);
  };

  const clearAllDrawings = () => {
    drawings.current.clear();
    setClearVersion((v) => v + 1);
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
        saveDrawing,
        getDrawing,
        clearAllDrawings,
        clearVersion,
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
