import {
  Coords,
  directions,
  genNewGrid,
  GridInfo,
  isCoordValid,
  runFnOnGrid,
} from '../utils/grid';
import { range } from '../utils/looping';

const parseTrees = (input: string[]) => {
  const numRows = input.length;
  const numCols = input[0].length;
  const gridInfo = genNewGrid({ numRows, numCols, defaultValue: 0 });
  runFnOnGrid({
    gridInfo,
    fnToRun: ({ coords: { x, y }, grid }) => (grid[x][y] = +input[x][y]),
  });
  return gridInfo;
};

const scanForTrees = (
  rowCol: number,
  direction: [number, number],
  gridInfo: GridInfo<number>,
  visibleTrees: Set<string>,
) => {
  const { numRows, numCols, grid } = gridInfo;
  const [dx, dy] = direction;
  const isForward = dx >= 0 && dy >= 0;
  const length = dx === 0 ? numCols : numRows;
  const [start, end] = isForward ? [0, length - 1] : [length - 1, 0];
  range(start, end).reduce((maxHeight, diff) => {
    const nx = dx ? diff : rowCol;
    const ny = dy ? diff : rowCol;
    if (grid[nx][ny] > maxHeight) {
      visibleTrees.add(`${nx},${ny}`);
      return grid[nx][ny];
    }
    return maxHeight;
  }, -1);
};

const getVisibleTrees = (gridInfo: GridInfo<number>) => {
  const { numRows, numCols, grid } = gridInfo;
  const visibleTrees = new Set<string>();
  range(numRows).forEach((x) => {
    scanForTrees(x, [0, 1], gridInfo, visibleTrees);
    scanForTrees(x, [0, -1], gridInfo, visibleTrees);
  });
  range(numCols).forEach((y) => {
    scanForTrees(y, [1, 0], gridInfo, visibleTrees);
    scanForTrees(y, [-1, 0], gridInfo, visibleTrees);
  });
  return visibleTrees;
};

const getScenicScore = (coords: Coords, gridInfo: GridInfo<number>) => {
  const { grid } = gridInfo;
  const { x, y } = coords;
  return directions.reduce((scenicScore, [dx, dy]) => {
    let nx = x + dx;
    let ny = y + dy;
    let neighbours = 0;
    while (
      isCoordValid({ x: nx, y: ny }, gridInfo) &&
      grid[nx][ny] < grid[x][y]
    ) {
      neighbours++;
      nx += dx;
      ny += dy;
    }
    if (isCoordValid({ x: nx, y: ny }, gridInfo)) neighbours++;
    return scenicScore * neighbours;
  }, 1);
};

const getMaxScenicScore = (gridInfo: GridInfo<number>) => {
  const { numRows, numCols } = gridInfo;
  let maxScenicScore = 0;
  range(1, numRows - 1).forEach((x) => {
    range(1, numCols - 1).forEach((y) => {
      const scenicScore = getScenicScore({ x, y }, gridInfo);
      if (scenicScore > maxScenicScore) maxScenicScore = scenicScore;
    });
  });
  return maxScenicScore;
};

export const day8 = (input: string[]) => {
  const gridInfo = parseTrees(input);
  const visibleTrees = getVisibleTrees(gridInfo);
  return visibleTrees.size;
};

export const day8part2 = (input: string[]) => {
  const gridInfo = parseTrees(input);
  return getMaxScenicScore(gridInfo);
};
