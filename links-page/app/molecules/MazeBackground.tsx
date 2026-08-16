"use client";

import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Maze, createMaze } from "../lib/maze";
import "../styles/maze-background.css";

/** Cada cuánto se genera un laberinto nuevo. */
const REGENERATE_MS = 45000;
/** Espera tras el último `resize` antes de regenerar, para no rehacerlo en cada píxel. */
const RESIZE_DEBOUNCE_MS = 300;
/** Cuánto tarda el explorador en pasar de una celda a la siguiente. */
const SECONDS_PER_STEP = 0.22;
/** Desplazamiento máximo del laberinto, en porcentaje de su propio tamaño. */
const MAX_DRIFT_PERCENT = 3;
/** Dos capas fijas que se alternan: mientras una se ve, la otra se rearma por detrás. */
const SLOT_COUNT = 2;

interface MazeLayer extends Maze {
  /** Dirección del desplazamiento, distinta en cada laberinto. */
  driftX: number;
  driftY: number;
}

interface MazeState {
  /** Una entrada por capa; `null` mientras esa capa todavía no dibujó nada. */
  layers: Array<MazeLayer | null>;
  /** Capa que está a la vista. */
  activeSlot: number;
}

/** La capa que se muestra primero es la 0, así que se arranca apuntando a la última. */
const INITIAL_STATE: MazeState = {
  layers: new Array(SLOT_COUNT).fill(null),
  activeSlot: SLOT_COUNT - 1,
};

function randomDrift(): { driftX: number; driftY: number } {
  const angle = Math.random() * Math.PI * 2;
  return {
    driftX: Number((Math.cos(angle) * MAX_DRIFT_PERCENT).toFixed(2)),
    driftY: Number((Math.sin(angle) * MAX_DRIFT_PERCENT).toFixed(2)),
  };
}

/**
 * Fondo decorativo: un laberinto generado en el navegador, con las paredes
 * pintadas con el degradado de la paleta y un punto amarillo que lo recorre
 * siguiendo el mismo camino que trazó el generador. Cada cierto tiempo aparece
 * uno nuevo con un fundido cruzado y se desplaza lentamente en otra dirección.
 * Es ornamental (`aria-hidden`) y se queda quieto si el sistema pide menos
 * movimiento.
 */
export default function MazeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ layers, activeSlot }, setMaze] = useState<MazeState>(INITIAL_STATE);
  /** El primer laberinto se muestra sin fundido; los siguientes sí lo usan. */
  const [instantFirstPaint, setInstantFirstPaint] = useState(true);

  /** Dibuja un laberinto nuevo en la capa que está oculta y la trae al frente. */
  const regenerate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const maze = { ...createMaze(container.clientWidth, container.clientHeight), ...randomDrift() };

    setMaze((current) => {
      const nextSlot = (current.activeSlot + 1) % SLOT_COUNT;
      return {
        activeSlot: nextSlot,
        layers: current.layers.map((layer, slot) => (slot === nextSlot ? maze : layer)),
      };
    });
  }, []);

  useEffect(() => {
    regenerate();

    // Dos cuadros de espera: recién cuando el primer laberinto se pintó se
    // habilita la transición, para que no aparezca desvaneciéndose.
    let firstFrame = 0;
    let secondFrame = 0;
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setInstantFirstPaint(false));
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rotation = reducedMotion.matches
      ? undefined
      : window.setInterval(regenerate, REGENERATE_MS);

    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(regenerate, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      if (rotation) window.clearInterval(rotation);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [regenerate]);

  return (
    <div className="maze-bg" aria-hidden="true" ref={containerRef}>
      {layers.map((layer, slot) => (
        <div
          key={slot}
          className={[
            "maze-bg__layer",
            slot === activeSlot && layer ? "is-active" : "",
            instantFirstPaint ? "is-instant" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={
            {
              "--drift-x": `${layer?.driftX ?? 0}%`,
              "--drift-y": `${layer?.driftY ?? 0}%`,
            } as CSSProperties
          }
        >
          {layer ? (
            <svg
              className="maze-bg__svg"
              viewBox={`0 0 ${layer.width} ${layer.height}`}
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* En coordenadas del lienzo: si no, cada pared repetiría el degradado entero. */}
                <linearGradient
                  id={`maze-gradient-${slot}`}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2={layer.width}
                  y2={layer.height}
                >
                  <stop offset="0%" stopColor="var(--maze-stop-1)" />
                  <stop offset="38%" stopColor="var(--maze-stop-2)" />
                  <stop offset="72%" stopColor="var(--maze-stop-3)" />
                  <stop offset="100%" stopColor="var(--maze-stop-4)" />
                </linearGradient>
              </defs>

              <g className="maze-bg__walls" fill={`url(#maze-gradient-${slot})`}>
                {layer.walls.map((wall) => (
                  <rect
                    key={`${wall.x}-${wall.y}-${wall.width}-${wall.height}`}
                    x={wall.x}
                    y={wall.y}
                    width={wall.width}
                    height={wall.height}
                    rx={layer.cornerRadius}
                  />
                ))}
              </g>

              <circle className="maze-bg__explorer" r={layer.cellSize * 0.17}>
                <animateMotion
                  dur={`${Math.round(layer.explorerSteps * SECONDS_PER_STEP)}s`}
                  repeatCount="indefinite"
                  path={layer.explorerPath}
                />
              </circle>
            </svg>
          ) : null}
        </div>
      ))}

      <div className="maze-bg__vignette" />
    </div>
  );
}
