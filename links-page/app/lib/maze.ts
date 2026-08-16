/**
 * Generador de laberintos "perfectos" (un único camino entre dos celdas
 * cualesquiera, sin ciclos) por backtracking recursivo, implementado con una
 * pila explícita para no depender de la profundidad de recursión.
 *
 * Devuelve el laberinto listo para dibujar: las paredes como rectángulos ya
 * fusionados (los tramos colineales se emiten como uno solo) y el recorrido
 * completo del algoritmo como un `path`, que se reutiliza para animar al
 * explorador.
 */

/** Lado de celda máximo y mínimo, en píxeles. */
const MAX_CELL_SIZE = 44;
const MIN_CELL_SIZE = 22;
/** Cuántas celdas se busca mostrar a lo ancho de la pantalla. */
const TARGET_COLUMNS = 26;
/** Grosor de pared, relativo al lado de la celda. */
const WALL_RATIO = 0.3;
/** Redondeo de las esquinas, relativo al grosor de la pared: apenas un suavizado. */
const CORNER_RATIO = 0.16;

export interface MazeWall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Maze {
  /** Paredes ya fusionadas, listas para dibujar como `<rect>`. */
  walls: MazeWall[];
  /** Recorrido del generador por el centro de las celdas, como comando `d`. */
  explorerPath: string;
  /** Cantidad de tramos del recorrido; sirve para calcular la duración. */
  explorerSteps: number;
  cellSize: number;
  cornerRadius: number;
  width: number;
  height: number;
}

type Grid = boolean[][];

function createGrid(columns: number, rows: number, value: boolean): Grid {
  return Array.from({ length: columns }, () => new Array<boolean>(rows).fill(value));
}

/**
 * Ajusta el lado de la celda al ancho disponible: en un teléfono, celdas
 * pensadas para escritorio dejarían apenas unas pocas columnas y el laberinto
 * no se leería como tal.
 */
export function pickCellSize(boxWidth: number): number {
  const fitted = Math.round(boxWidth / TARGET_COLUMNS);
  return Math.min(MAX_CELL_SIZE, Math.max(MIN_CELL_SIZE, fitted));
}

/** Agrupa posiciones consecutivas con pared en tramos `[desde, hasta)`. */
function collectRuns(isWall: (index: number) => boolean, length: number): Array<[number, number]> {
  const runs: Array<[number, number]> = [];
  let runStart: number | null = null;

  for (let index = 0; index <= length; index += 1) {
    const wallHere = index < length && isWall(index);
    if (wallHere && runStart === null) runStart = index;
    if (!wallHere && runStart !== null) {
      runs.push([runStart, index]);
      runStart = null;
    }
  }
  return runs;
}

/**
 * Genera un laberinto que cubre al menos `boxWidth` × `boxHeight` píxeles.
 * Usa `Math.random`, así que solo debe llamarse en el cliente.
 */
export function createMaze(boxWidth: number, boxHeight: number): Maze {
  const cellSize = pickCellSize(boxWidth);
  const thickness = Math.round(cellSize * WALL_RATIO);
  const half = thickness / 2;
  const columns = Math.max(3, Math.ceil(boxWidth / cellSize));
  const rows = Math.max(3, Math.ceil(boxHeight / cellSize));

  // `vertical[c][r]`: pared sobre el borde izquierdo de la celda (c, r).
  const vertical = createGrid(columns + 1, rows, true);
  // `horizontal[c][r]`: pared sobre el borde superior de la celda (c, r).
  const horizontal = createGrid(columns, rows + 1, true);
  const visited = createGrid(columns, rows, false);

  const startColumn = Math.floor(Math.random() * columns);
  const startRow = Math.floor(Math.random() * rows);
  visited[startColumn][startRow] = true;

  const stack: Array<[number, number]> = [[startColumn, startRow]];
  /** Todas las celdas por las que pasa el algoritmo, incluida la vuelta atrás. */
  const walk: Array<[number, number]> = [[startColumn, startRow]];

  while (stack.length > 0) {
    const [column, row] = stack[stack.length - 1];

    const neighbours: Array<[number, number]> = [
      [column + 1, row],
      [column - 1, row],
      [column, row + 1],
      [column, row - 1],
    ];
    const candidates = neighbours.filter(
      ([c, r]) => c >= 0 && c < columns && r >= 0 && r < rows && !visited[c][r]
    );

    if (candidates.length === 0) {
      stack.pop();
      // Al volver sobre sus pasos el recorrido sigue siendo continuo.
      if (stack.length > 0) walk.push(stack[stack.length - 1]);
      continue;
    }

    const [nextColumn, nextRow] = candidates[Math.floor(Math.random() * candidates.length)];

    // Derriba la pared que separa la celda actual de la elegida.
    if (nextColumn > column) vertical[column + 1][row] = false;
    else if (nextColumn < column) vertical[column][row] = false;
    else if (nextRow > row) horizontal[column][row + 1] = false;
    else horizontal[column][row] = false;

    visited[nextColumn][nextRow] = true;
    stack.push([nextColumn, nextRow]);
    walk.push([nextColumn, nextRow]);
  }

  const walls: MazeWall[] = [];

  for (let column = 0; column <= columns; column += 1) {
    for (const [from, to] of collectRuns((row) => vertical[column][row], rows)) {
      walls.push({
        x: column * cellSize - half,
        y: from * cellSize - half,
        width: thickness,
        height: (to - from) * cellSize + thickness,
      });
    }
  }

  for (let row = 0; row <= rows; row += 1) {
    for (const [from, to] of collectRuns((column) => horizontal[column][row], columns)) {
      walls.push({
        x: from * cellSize - half,
        y: row * cellSize - half,
        width: (to - from) * cellSize + thickness,
        height: thickness,
      });
    }
  }

  const explorerPath = walk
    .map(([column, row], index) => {
      const x = column * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join("");

  return {
    walls,
    explorerPath,
    explorerSteps: Math.max(1, walk.length - 1),
    cellSize,
    cornerRadius: Math.round(thickness * CORNER_RATIO * 100) / 100,
    width: columns * cellSize,
    height: rows * cellSize,
  };
}
