import { Coords, genNewGrid, GridInfo } from '../utils/grid';
import { range } from '../utils/looping';

type Rocks = Coords[];
enum CaveItem {
  ROCK = '#',
  AIR = '.',
  SAND = 'o',
  ENTRY = '+',
}

const SAND_ENTRY: Coords = { x: 500, y: 0 };

const parseAllRocks = (input: string[]): Rocks[] =>
  input.map((line) => {
    const coordStrings = line.split(' -> ');
    return coordStrings.map((coordString) => {
      const [x, y] = coordString.split(',');
      return { x: +x, y: +y };
    });
  });

const getCaveDimensions = (allRocks: Rocks[]) => {
  const max = allRocks.reduce((caveMax, rocks) => {
    const rocksMax = rocks.reduce(
      (rockInternalMax, rock) => {
        const { x, y } = rock;
        return {
          x: Math.max(x, rockInternalMax.x),
          y: Math.max(y, rockInternalMax.y),
        };
      },
      {
        x: 0,
        y: 0,
      },
    );
    return {
      x: Math.max(rocksMax.x, caveMax.x),
      y: Math.max(rocksMax.y, caveMax.y),
    };
  }, SAND_ENTRY);
  return { x: max.x + 1000, y: max.y + 2 };
};

const getCave = (input: string[]) => {
  const allRocks = parseAllRocks(input);
  const caveDimensions = getCaveDimensions(allRocks);
  const gridInfo = genNewGrid({
    numRows: caveDimensions.x,
    numCols: caveDimensions.y,
    defaultValue: CaveItem.AIR,
  });
  const { grid } = gridInfo;
  allRocks.forEach((rocks) => {
    rocks.forEach((rock, index) => {
      if (index === rocks.length - 1) return;
      const { x: startX, y: startY } = rock;
      const { x: endX, y: endY } = rocks[index + 1];
      range(Math.min(startY, endY), Math.max(startY, endY) + 1).forEach((y) => {
        grid[startX][y] = CaveItem.ROCK;
      });
      range(Math.min(startX, endX), Math.max(startX, endX) + 1).forEach((x) => {
        grid[x][startY] = CaveItem.ROCK;
      });
    });
  });
  grid[SAND_ENTRY.x][SAND_ENTRY.y] = CaveItem.ENTRY;
  return gridInfo;
};

export const printCave = (
  gridInfo: GridInfo<CaveItem>,
  start: number = 470,
  end: number = 570,
): string => {
  const { numCols, grid } = gridInfo;
  return range(numCols).reduce(
    (printValue, y) =>
      printValue +
      range(start, end)
        .reduce((row, x) => row + grid[x][y] + ' ', '')
        .slice(0, -1) +
      '\n',
    '',
  );
};

const dropSand = (cave: GridInfo<CaveItem>) => {
  let sandLocation = { ...SAND_ENTRY };
  const { grid, numCols } = cave;
  let stationary = false;
  let moves = 0;
  while (!stationary) {
    const { x, y } = sandLocation;
    if (y === numCols - 1) {
      stationary = true;
    } else {
      if (grid[x][y + 1] === CaveItem.AIR) {
        sandLocation.y = y + 1;
      } else if (grid[x - 1][y + 1] === CaveItem.AIR) {
        sandLocation = { x: x - 1, y: y + 1 };
      } else if (grid[x + 1][y + 1] === CaveItem.AIR) {
        sandLocation = { x: x + 1, y: y + 1 };
      } else {
        stationary = true;
      }
    }
    moves++;
  }
  grid[sandLocation.x][sandLocation.y] = CaveItem.SAND;
  return { sandLocation, moves };
};

const dropAllSand = (cave: GridInfo<CaveItem>, end: 'abyss' | 'clog') => {
  let lastSand = { x: 0, y: 0 };
  let numSandDropped = 0;
  while (
    end === 'clog'
      ? !(lastSand.x === 500 && lastSand.y === 0)
      : lastSand.y < cave.numCols - 1
  ) {
    const { sandLocation, moves } = dropSand(cave);
    lastSand = sandLocation;
    numSandDropped++;
  }
  return numSandDropped;
};

export const day14 = (input: string[]) => {
  const cave = getCave(input);
  const numSandDropped = dropAllSand(cave, 'abyss');
  return numSandDropped - 1;
};

export const day14part2 = (input: string[]) => {
  const cave = getCave(input);
  const numSandDropped = dropAllSand(cave, 'clog');
  return numSandDropped;
};
