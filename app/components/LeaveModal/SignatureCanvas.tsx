"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Trash2 } from "lucide-react";
import { penCursor, svgToCursor } from "@/lib/svgUtils";

export interface SignatureCanvasHandle {
  getBlob: () => Promise<Blob | null>;
  hasSignature: () => boolean;
}

// interface SignatureCanvasProps {}

const SignatureCanvas = forwardRef<SignatureCanvasHandle>((_, ref) => {
  const [color, setColor] = useState("#000000");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasDrawn = useRef(false);

  useImperativeHandle(ref, () => ({
    getBlob: () =>
      new Promise((resolve) => {
        const canvas = canvasRef.current;

        if (!canvas) {
          resolve(null);
          return;
        }

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      }),
    hasSignature: () => hasDrawn.current,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
  }, [color]);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    drawing.current = true;
    hasDrawn.current = true;

    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={clear}
        className="
            rounded-md
            p-2
            hover:bg-gray-200
            transition-colors
          "
        aria-label="Clear signature"
      >
        <Trash2 size={20} />
      </button>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <canvas
        className="touch-none"
        ref={canvasRef}
        width={400}
        height={150}
        style={{
          cursor: svgToCursor(penCursor(color), 10, 122),
        }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
      />
    </div>
  );
});

SignatureCanvas.displayName = "SignatureCanvas";

export default SignatureCanvas;
