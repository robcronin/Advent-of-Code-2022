import {
  Coords,
  findValueInGrid,
  genNewGrid,
  getNeighbourCoords,
  GridInfo,
  runFnOnGrid,
} from '../utils/grid';

type HeightMap = {
  gridInfo: GridInfo<number>;
  start: Coords;
  end: Coords;
};

const parseHeightMap = (input: string[]): HeightMap => {
  const numRows = input.length;
  const numCols = input[0].length;
  const emptyGridInfo = genNewGrid({ numRows, numCols, defaultValue: 0 });
  const gridInfo = runFnOnGrid({
    gridInfo: emptyGridInfo,
    fnToRun: ({ coords: { x, y } }) => {
      if (input[x][y] === 'S') return 0;
      if (input[x][y] === 'E') return 27;
      return input[x][y].charCodeAt(0) - 96;
    },
  });
  const start = findValueInGrid(gridInfo, 0)[0];
  const end = findValueInGrid(gridInfo, 27)[0];
  return { gridInfo, start, end };
};

export const getMinSteps = (heightMap: HeightMap): number => {
  const { gridInfo, start, end } = heightMap;
  const { numRows, numCols, grid } = gridInfo;

  const { grid: visitedGrid } = genNewGrid({
    ...gridInfo,
    defaultValue: false,
  });

  const queue: { coords: Coords; cost: number }[] = [
    { coords: start, cost: 0 },
  ];
  let ans: number = numRows * numCols;

  while (!visitedGrid[end.x][end.y]) {
    const nextNode = queue.shift();
    if (!nextNode) break;
    const { coords, cost: nodeCost } = nextNode;
    if (coords.x === end.x && coords.y === end.y) {
      ans = nodeCost;
      break;
    }
    const { x, y } = coords;
    const validNeighbours = getNeighbourCoords({ coords, gridInfo }).filter(
      ({ x: neighX, y: neighY }) => grid[neighX][neighY] - grid[x][y] <= 1,
    );
    validNeighbours.forEach((neighbour) => {
      const { x: neighX, y: neighY } = neighbour;
      if (!visitedGrid[neighX][neighY]) {
        const currentNeighboutCost =
          queue.find((a) => a.coords.x === neighX && a.coords.y === neighY)
            ?.cost || numRows * numCols;
        const potentialMinCost = nodeCost + 1;
        if (potentialMinCost < currentNeighboutCost) {
          queue.push({
            coords: { x: neighX, y: neighY },
            cost: nodeCost + 1,
          });
        }
      }
      queue.sort((a, b) => a.cost - b.cost);
    });

    visitedGrid[x][y] = true;
  }
  return ans;
};

export const day12 = (input: string[]) => {
  const heightMap = parseHeightMap(input);
  const minSteps = getMinSteps(heightMap);
  return minSteps;
};

export const day12part2 = (input: string[]) => {
  const { end, gridInfo } = parseHeightMap(input);
  const { numRows, numCols } = gridInfo;

  const starts = findValueInGrid(gridInfo, 1);
  return starts.reduce(
    (minSteps, start) =>
      Math.min(minSteps, getMinSteps({ gridInfo, start, end })),
    numRows * numCols,
  );
};
