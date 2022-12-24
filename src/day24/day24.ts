import {
  Coords,
  genNewGrid,
  getNeighbourCoords,
  GridInfo,
  runFnOnGrid,
} from '../utils/grid';
import { range } from '../utils/looping';

type Blizzard = '>' | 'v' | '<' | '^';
const blizzardDirections: Record<Blizzard, number[]> = {
  '>': [0, 1],
  '<': [0, -1],
  '^': [-1, 0],
  v: [1, 0],
};
enum GridItem {
  GROUND = '.',
  WALL = '#',
}
type Map = GridInfo<GridItem | Blizzard[]>;
type MapValue = GridItem | Blizzard[];

const parseMap = (input: string[]) => {
  const emptyGrid: Map = genNewGrid({
    numRows: input.length,
    numCols: input[0].length,
    defaultValue: GridItem.GROUND,
  });
  const map = runFnOnGrid({
    gridInfo: emptyGrid,
    fnToRun: ({ coords: { x, y } }) => {
      const value = input[x][y] as GridItem | Blizzard;
      if (value === GridItem.WALL) return value;
      if (value == GridItem.GROUND) return [];
      return [value];
    },
  });
  return map;
};

export const printMap = (map: Map): string => {
  const { numRows, numCols, grid } = map;
  return range(numRows).reduce(
    (printValue, x) =>
      printValue +
      range(numCols)
        .reduce((row, y) => {
          let value: MapValue | number = grid[x][y];
          if (typeof value === 'object') {
            if (value.length === 0) value = GridItem.GROUND;
            else if (value.length === 1) value = value;
            else value = value.length;
          }
          return row + `${value}` + ' ';
        }, '')
        .slice(0, -1) +
      '\n',
    '',
  );
};

const genEmptyMap = (map: Map) =>
  runFnOnGrid({
    gridInfo: map,
    fnToRun: ({ value }) => {
      if (value === GridItem.WALL) return GridItem.WALL;
      return [];
    },
  });

const moveBlizzards = (map: Map) => {
  const { numRows, numCols } = map;
  const newMap = genEmptyMap(map);
  range(1, numRows - 1).forEach((x) => {
    range(1, numCols - 1).forEach((y) => {
      const value = map.grid[x][y] as unknown as Blizzard[];
      value.forEach((blizzard) => {
        const direction = blizzardDirections[blizzard];
        let dx = direction[0];
        let dy = direction[1];
        if (newMap.grid[x + dx][y + dy] === GridItem.WALL) {
          dx -= dx * (numRows - 2);
          dy -= dy * (numCols - 2);
        }
        newMap.grid[x + dx][y + dy].push(blizzard);
      });
    });
  });
  return newMap;
};

const navigateGrid = (
  map: Map,
  currentStepOptions: Set<string>,
  target: Coords,
  currentSteps: number,
): number => {
  const nextStepOptions = new Set<string>();
  const newGridInfo = moveBlizzards(map);

  let targetHit: number | undefined;

  currentStepOptions.forEach((option) => {
    if (targetHit) return;
    const [xs, ys] = option.split(',');
    const x = +xs;
    const y = +ys;
    if (x === target.x && y === target.y) {
      targetHit = currentSteps;
    }
    const neighbours = getNeighbourCoords({ coords: { x, y }, gridInfo: map });
    neighbours.push({ x, y });
    const nextOptions = neighbours.filter(({ x, y }) => {
      const value = newGridInfo.grid[x][y];
      const isWall = value === GridItem.WALL;
      const isBlizzard = typeof value === 'object' ? value.length : false;
      return !isWall && !isBlizzard;
    });
    nextOptions.forEach(({ x, y }) => {
      nextStepOptions.add(`${x},${y}`);
    });
  });
  if (targetHit) return targetHit;
  return navigateGrid(newGridInfo, nextStepOptions, target, currentSteps + 1);
};

const getMinSteps = (
  map: Map,
  start: Coords,
  target: Coords,
  startingTime: number = 0,
) => {
  const startOption = `${start.x},${start.y}`;
  let startingMap = map;
  range(startingTime).forEach(() => {
    startingMap = moveBlizzards(startingMap);
  });
  return navigateGrid(
    startingMap,
    new Set<string>().add(startOption),
    target,
    startingTime,
  );
};

export const day24 = (input: string[]) => {
  const map = parseMap(input);
  const { numRows, numCols } = map;
  const start = { x: 0, y: 1 };
  const target = { x: numRows - 1, y: numCols - 2 };
  return getMinSteps(map, start, target);
};

export const day24part2 = (input: string[]) => {
  const map = parseMap(input);
  const { numRows, numCols } = map;
  const start = { x: 0, y: 1 };
  const target = { x: numRows - 1, y: numCols - 2 };

  const overSteps = getMinSteps(map, start, target);
  const backSteps = getMinSteps(map, target, start, overSteps);
  const overAgainSteps = getMinSteps(map, start, target, backSteps);
  return overAgainSteps;
};
