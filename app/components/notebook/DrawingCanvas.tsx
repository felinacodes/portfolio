import { useRef } from "react";
import { useDrawing } from "@/contexts/DrawingContext";
import {
  svgToCursor,
  pencilCursor,
  highlighterCursor,
  penCursor,
  eraserCursor,
} from "@/lib/svgUtils";

export default function DrawingCanvas() {
  const { activeTool, drawingEnabled, activeColor } = useDrawing();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cursor =
    activeTool === "pencil"
      ? svgToCursor(pencilCursor(activeColor), 5, 30)
      : activeTool === "highlighter"
        ? svgToCursor(highlighterCursor(activeColor), 5, 30)
        : activeTool === "pen"
          ? svgToCursor(penCursor(activeColor), 5, 30)
          : activeTool === "eraser"
            ? svgToCursor(eraserCursor(), 5, 30)
            : "default";
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-10 w-full h-full ${
        drawingEnabled ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        cursor,
      }}
    />
  );
}
