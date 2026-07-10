import { useRef, useEffect } from "react";
import { useDrawing } from "@/contexts/DrawingContext";
import {
  svgToCursor,
  pencilCursor,
  highlighterCursor,
  penCursor,
  eraserCursor,
} from "@/lib/svgUtils";
import { useSound } from "@/contexts/SoundContext";

export default function DrawingCanvas() {
  const { activeTool, drawingEnabled, activeColor } = useDrawing();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const { startLoop, stopLoop } = useSound();

  const { play } = useSound();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getContext = () => {
    return canvasRef.current?.getContext("2d");
  };

  const applyTool = (ctx: CanvasRenderingContext2D) => {
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (activeTool) {
      case "pencil":
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.8;
        ctx.lineCap = "butt";
        ctx.globalCompositeOperation = "multiply";
        break;

      case "pen":
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 3;
        break;

      case "highlighter":
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 15;
        ctx.globalAlpha = 0.07;
        ctx.lineCap = "round";
        ctx.globalCompositeOperation = "multiply";
        break;

      case "eraser":
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 15;
        break;
    }
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeTool) return;

    isDrawing.current = true;

    const point = getPoint(e);
    lastPoint.current = point;

    canvasRef.current?.setPointerCapture(e.pointerId);

    startLoop(activeTool);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;

    stopLoop();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPoint.current) return;

    const ctx = getContext();
    if (!ctx) return;

    applyTool(ctx);

    const events = e.nativeEvent.getCoalescedEvents(); //for clear continues line - no single points

    const points = events.length > 0 ? events : [e.nativeEvent];

    const rect = canvasRef.current!.getBoundingClientRect();

    points.forEach((event) => {
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      ctx.beginPath();

      ctx.moveTo(lastPoint.current!.x, lastPoint.current!.y);
      ctx.lineTo(point.x, point.y);

      ctx.stroke();

      lastPoint.current = point;
    });
  };

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
      onPointerDown={startDrawing}
      onPointerMove={draw}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      className={`border-2 absolute inset-0 z-10 w-full h-full ${
        drawingEnabled ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        cursor,
      }}
    />
  );
}
