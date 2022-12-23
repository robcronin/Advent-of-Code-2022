/*
  Note: The x and y coordinates are backwards from convention
      x is the rowNumber
      y is the colNumber
  This usually matches how the AoC puzzles are defined
*/

import { range } from './looping';

export type Grid<ValueType> = ValueType[][];
export type GridInfo<ValueType> = {
  grid: Grid<ValueType>;
  numRows: number;
  numCols: number;
};
export type Coords = { x: number; y: number };

export const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export const genNewGrid = <ValueType>({
  numRows,
  numCols,
  defaultValue,
}: {
  numRows: number;
  numCols: number;
  defaultValue: ValueType;
}): GridInfo<ValueType> => {
  const newGrid: Grid<ValueType> = [];
  range(numRows).forEach((x) => {
    range(numCols).forEach((y) => {
      if (!newGrid[x]) newGrid.push([]);
      newGrid[x][y] = defaultValue;
    });
  });
  return { numRows, numCols, grid: newGrid };
};

export const deepCopyGrid = <ValueType>({
  gridInfo,
}: {
  gridInfo: GridInfo<ValueType>;
}): GridInfo<ValueType> => {
  const newGrid: Grid<ValueType> = [];
  const { numRows, numCols, grid } = gridInfo;
  range(numRows).forEach((x) => {
    range(numCols).forEach((y) => {
      if (!newGrid[x]) newGrid.push([]);
      newGrid[x][y] = grid[x][y];
    });
  });
  return { numRows, numCols, grid: newGrid };
};

export const getNeighbourCoords = <ValueType>({
  coords,
  gridInfo,
  isDiagonal,
}: {
  coords: Coords;
  gridInfo: GridInfo<ValueType>;
  isDiagonal?: boolean;
}): Coords[] => {
  const { x, y } = coords;
  const { numRows, numCols } = gridInfo;
  const neighbourCoords = [];
  if (x > 0) neighbourCoords.push({ x: x - 1, y });
  if (y > 0) neighbourCoords.push({ x, y: y - 1 });
  if (x < numRows - 1) neighbourCoords.push({ x: x + 1, y });
  if (y < numCols - 1) neighbourCoords.push({ x, y: y + 1 });
  if (isDiagonal) {
    if (x > 0 && y > 0) neighbourCoords.push({ x: x - 1, y: y - 1 });
    if (x > 0 && y < numCols - 1) neighbourCoords.push({ x: x - 1, y: y + 1 });
    if (x < numRows - 1 && y > 0) neighbourCoords.push({ x: x + 1, y: y - 1 });
    if (x < numRows - 1 && y < numCols - 1)
      neighbourCoords.push({ x: x + 1, y: y + 1 });
  }
  return neighbourCoords;
};

export const runFnOnGrid = <ValueType>({
  gridInfo,
  fnToRun,
}: {
  gridInfo: GridInfo<ValueType>;
  fnToRun: (arg: {
    coords: Coords;
    grid: Grid<ValueType>;
    value: ValueType;
  }) => ValueType;
}): GridInfo<ValueType> => {
  const newGrid: Grid<ValueType> = [];
  const { numRows, numCols, grid } = gridInfo;
  range(numRows).forEach((x) => {
    range(numCols).forEach((y) => {
      if (!newGrid[x]) newGrid.push([]);
      newGrid[x][y] = fnToRun({ coords: { x, y }, grid, value: grid[x][y] });
    });
  });
  return { numRows, numCols, grid: newGrid };
};

export const printGrid = <ValueType>(gridInfo: GridInfo<ValueType>): string => {
  const { numRows, numCols, grid } = gridInfo;
  return range(numRows).reduce(
    (printValue, x) =>
      printValue +
      range(numCols)
        .reduce((row, y) => row + grid[x][y] + ' ', '')
        .slice(0, -1) +
      '\n',
    '',
  );
};

export const reversePrintGrid = <ValueType>(
  gridInfo: GridInfo<ValueType>,
): string => {
  const { numRows, numCols, grid } = gridInfo;
  return range(numCols).reduce(
    (printValue, y) =>
      printValue +
      range(numRows)
        .reduce((row, x) => row + grid[x][y] + ' ', '')
        .slice(0, -1) +
      '\n',
    '',
  );
};

export const countValueInGrid = <ValueType>(
  gridInfo: GridInfo<ValueType>,
  value: ValueType,
): number => {
  const { numRows, numCols, grid } = gridInfo;
  return range(numRows).reduce(
    (sumTotal, x) =>
      sumTotal +
      range(numCols).reduce(
        (sumRow, y) => (grid[x][y] === value ? sumRow + 1 : sumRow),
        0,
      ),
    0,
  );
};

export const isCoordValid = <ValueType>(
  coords: Coords,
  gridInfo: GridInfo<ValueType>,
) => {
  const { x, y } = coords;
  const { numRows, numCols } = gridInfo;
  return x >= 0 && x < numRows && y >= 0 && y < numCols;
};

export const findValueInGrid = <ValueType>(
  gridInfo: GridInfo<ValueType>,
  value: ValueType,
): Coords[] => {
  const { numRows, numCols, grid } = gridInfo;
  const coords: Coords[] = [];
  range(numRows).forEach((x) => {
    const yIndex = range(numCols).findIndex((y) => grid[x][y] === value);
    if (yIndex !== -1) coords.push({ x, y: yIndex });
  });
  return coords;
};
