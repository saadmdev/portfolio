"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
}

export function Globe({ className, size = 480 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous globe if exists
    if (globeRef.current) {
      globeRef.current.destroy();
    }

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [33.6844, 73.0479], size: 0.1 }, // Pakistan
        { location: [14.5995, 120.9842], size: 0.03 },
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [23.8103, 90.4125], size: 0.05 },
        { location: [30.0444, 31.2357], size: 0.07 },
        { location: [39.9042, 116.4074], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [19.4326, -99.1332], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [34.6937, 135.5022], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
      ],
      onRender: (state) => {
        // Auto-rotate when not interacting
        if (!pointerInteracting.current) {
          phiRef.current += 0.005;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
      },
    });

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [size]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          maxWidth: "100%",
          aspectRatio: "1",
          cursor: "grab",
        }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
          }
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) {
            canvasRef.current.style.cursor = "grab";
          }
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current += delta / 200;
            pointerInteracting.current = e.clientX;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current += delta / 200;
            pointerInteracting.current = e.touches[0].clientX;
          }
        }}
      />
    </div>
  );
}

export default Globe;
