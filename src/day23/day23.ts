import {
  deepCopyExpandingGrid,
  ExpandingGrid,
  genNewExpandingGrid,
  getExpandingDimensions,
  getNeighbourExpandingCoords,
  getValueExpandingGrid,
  runFnOnExpandingGrid,
  setValueExpandingGrid,
} from '../utils/expandingGrid';
import { Coords } from '../utils/grid';
import { range } from '../utils/looping';

enum GridItem {
  ELF = '#',
  GROUND = '.',
  EMPTY = ' ',
}

type Move = {
  neighbourDeltas: number[][];
  moveDelta: number[];
};

const parseGrid = (input: string[]) => {
  const numRows = input.length;
  const numCols = input[0].length;
  const grid = genNewExpandingGrid({
    numRows,
    numCols,
    defaultValue: GridItem.EMPTY,
  });
  runFnOnExpandingGrid(grid, ({ coords: { x, y } }) => input[x][y] as GridItem);
  return grid;
};

const getElves = (grid: ExpandingGrid<GridItem>) => {
  const elves: Coords[] = [];
  runFnOnExpandingGrid(
    grid,
    ({ value, coords }) => {
      if (value === GridItem.ELF) elves.push(coords);
    },
    true,
  );
  return elves;
};

const moveOptions: Move[] = [
  {
    neighbourDeltas: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ],
    moveDelta: [-1, 0],
  },
  {
    neighbourDeltas: [
      [1, -1],
      [1, 0],
      [1, 1],
    ],
    moveDelta: [1, 0],
  },
  {
    neighbourDeltas: [
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    moveDelta: [0, -1],
  },
  {
    neighbourDeltas: [
      [-1, 1],
      [0, 1],
      [1, 1],
    ],
    moveDelta: [0, 1],
  },
];

const getProposedMove = (
  grid: ExpandingGrid<GridItem>,
  elf: Coords,
  moveIndex: number,
): Move | undefined => {
  const { x, y } = elf;
  const neighbours = getNeighbourExpandingCoords({ x, y }, true);
  const hasElfNeighbour = neighbours.some(
    (n) => getValueExpandingGrid(grid, { x: n.x, y: n.y }) === GridItem.ELF,
  );
  if (hasElfNeighbour) {
    const moveOptionOffset = range(moveOptions.length).find(
      (startMoveIndex) => {
        const option =
          moveOptions[(startMoveIndex + moveIndex) % moveOptions.length];
        const noNeighbours = option.neighbourDeltas.every(
          ([dx, dy]) =>
            getValueExpandingGrid(grid, { x: x + dx, y: y + dy }) !==
            GridItem.ELF,
        );
        if (noNeighbours) return true;
      },
    );
    if (moveOptionOffset !== undefined) {
      const proposedMove =
        moveOptions[(moveOptionOffset + moveIndex) % moveOptions.length];
      return proposedMove;
    }
  }
};

const runRound = (grid: ExpandingGrid<GridItem>, moveIndex: number) => {
  const elves = getElves(grid);
  const newGrid = deepCopyExpandingGrid(grid);
  const attemptedMoves: Record<string, number> = {};
  let numMovingElves = 0;
  elves.forEach((elf) => {
    const { x, y } = elf;
    const proposedMove = getProposedMove(grid, elf, moveIndex);
    if (proposedMove) {
      const [dx, dy] = proposedMove.moveDelta;
      const attemptKey = `${x + dx},${y + dy}`;
      if (attemptedMoves[attemptKey]) attemptedMoves[attemptKey]++;
      else attemptedMoves[attemptKey] = 1;
    }
  });
  elves.forEach((elf) => {
    const { x, y } = elf;
    const proposedMove = getProposedMove(grid, elf, moveIndex);
    if (proposedMove) {
      const [dx, dy] = proposedMove.moveDelta;
      const attemptKey = `${x + dx},${y + dy}`;
      if (attemptedMoves[attemptKey] === 1) {
        const [dx, dy] = proposedMove.moveDelta;
        setValueExpandingGrid(newGrid, { x, y }, GridItem.GROUND);
        setValueExpandingGrid(newGrid, { x: x + dx, y: y + dy }, GridItem.ELF);
        numMovingElves++;
      }
    }
  });
  return { newGrid, numMovingElves };
};

const runNumRounds = (
  grid: ExpandingGrid<GridItem>,
  numRounds: number,
  startingMoveIndex: number = 0,
) => {
  return range(numRounds).reduce((currentGrid, moveIndex) => {
    const { newGrid } = runRound(currentGrid, startingMoveIndex + moveIndex);
    return newGrid;
  }, deepCopyExpandingGrid(grid));
};

const runToSteadyState = (grid: ExpandingGrid<GridItem>) => {
  let currentMovingElves = 1;
  let currentGrid = deepCopyExpandingGrid(grid);
  let moveIndex = 0;
  while (currentMovingElves > 0) {
    const { newGrid, numMovingElves } = runRound(currentGrid, moveIndex);
    currentGrid = newGrid;
    currentMovingElves = numMovingElves;
    moveIndex++;
  }
  return moveIndex;
};

const getNumEmpty = (grid: ExpandingGrid<GridItem>) => {
  const numElves = getElves(grid).length;
  const { minX, maxX, minY, maxY } = getExpandingDimensions(grid);
  const gridSize = (maxX - minX + 1) * (maxY - minY + 1);
  return gridSize - numElves;
};

export const day23 = (input: string[]) => {
  const grid = parseGrid(input);
  const newGrid = runNumRounds(grid, 10);
  return getNumEmpty(newGrid);
};

export const day23part2 = (input: string[]) => {
  const grid = parseGrid(input);
  const numMovesUntilNoMove = runToSteadyState(grid);
  return numMovesUntilNoMove;
};
