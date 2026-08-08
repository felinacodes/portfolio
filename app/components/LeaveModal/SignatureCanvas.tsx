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
import { motion } from "framer-motion";

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
  const colorInputRef = useRef<HTMLInputElement>(null);

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

    ctx.lineWidth = 1.3;
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
    <div className="relative ">
      <div className="m-2 absolute top-0 right-0 flex flex-col items-center justify-center">
        <div className="">
          <motion.button
            whileTap={{
              scale: 0.92,
            }}
            onClick={() => colorInputRef.current?.click()}
            className="relative z-1 cursor-pointer"
            aria-label="Choose color "
          >
            <div
              className="w-5 h-5 rounded-full border cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </motion.button>

          <motion.input
            ref={colorInputRef}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute opacity-0 pointer-events-none"
          />
        </div>

        <button
          onClick={clear}
          className="         
            m-2
            rounded-md        
            transition-colors
            cursor-pointer
          "
          aria-label="Clear signature"
        >
          <Trash2 size={20} color="black" />
        </button>
      </div>

      <canvas
        className="touch-none
        border-2
        rounded-md
        border-gray-300
        bg-amber-100
        w-[250px]
        max-w-full
        aspect-[5/3]"
        ref={canvasRef}
        width={250}
        height={150}
        style={{
          cursor: svgToCursor(penCursor(color), 5, 124),
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
