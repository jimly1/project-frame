import { useEffect, useRef } from "react";
import type { FaceLandmarks68 } from "face-api.js";

interface LandmarkCanvasProps {
  image: HTMLImageElement;
  landmarks: FaceLandmarks68;
  detection: { x: number; y: number; width: number; height: number };
}

const LandmarkCanvas = ({ image, landmarks, detection }: LandmarkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Scale to fit container while maintaining aspect ratio
    const maxWidth = 500;
    const scale = Math.min(maxWidth / image.width, 1);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw detection box
    ctx.strokeStyle = "hsl(192, 82%, 42%)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      detection.x * scale,
      detection.y * scale,
      detection.width * scale,
      detection.height * scale
    );

    // Draw landmarks
    const points = landmarks.positions;
    const groups = [
      { range: [0, 17], color: "hsl(192, 82%, 42%)" },   // jaw
      { range: [17, 22], color: "hsl(172, 60%, 40%)" },   // left brow
      { range: [22, 27], color: "hsl(172, 60%, 40%)" },   // right brow
      { range: [27, 36], color: "hsl(38, 92%, 50%)" },    // nose
      { range: [36, 42], color: "hsl(210, 70%, 50%)" },   // left eye
      { range: [42, 48], color: "hsl(210, 70%, 50%)" },   // right eye
      { range: [48, 68], color: "hsl(0, 72%, 55%)" },     // mouth
    ];

    groups.forEach(({ range, color }) => {
      for (let i = range[0]; i < range[1]; i++) {
        const p = points[i];
        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Connect adjacent points with lines
        if (i > range[0]) {
          const prev = points[i - 1];
          ctx.beginPath();
          ctx.moveTo(prev.x * scale, prev.y * scale);
          ctx.lineTo(p.x * scale, p.y * scale);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });
  }, [image, landmarks, detection]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-2xl border border-border shadow-card max-w-full"
      />
    </div>
  );
};

export default LandmarkCanvas;
