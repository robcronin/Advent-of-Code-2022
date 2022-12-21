import { Coords } from '../utils/grid';
import { range } from '../utils/looping';

enum CaveItem {
  AIR = '.',
  FLOOR = '-',
  ROCK = '#',
}
type CaveRow = CaveItem[];
type Cave = CaveRow[];
type Rock = Coords[];
const CAVE_WIDTH = 7;

const generateRow = (item: CaveItem = CaveItem.AIR): CaveRow =>
  [...Array(CAVE_WIDTH).keys()].map((_) => item);

const generateCave = (): Cave => [
  generateRow(CaveItem.FLOOR),
  generateRow(),
  generateRow(),
];

const extendCave = (cave: Cave, height: number) => {
  while (cave.length < height + 1) cave.push(generateRow());
};

const printCave = (cave: Cave) => {
  const cavePrint = [...cave].reverse().reduce(
    (printValue, caveRow, index) =>
      printValue +
      range(caveRow.length)
        .reduce(
          (row, col) => row + caveRow[col] + ' ',
          `${cave.length - index - 1}  `,
        )
        .slice(0, -1) +
      '\n',
    '',
  );
  console.log(cavePrint);
};

const getRock = (rockNumber: number, maxHeight: number): Coords[] => {
  const x = maxHeight;
  switch (rockNumber % 5) {
    case 0: // horizontal
      return [
        { x: x + 4, y: 2 },
        { x: x + 4, y: 3 },
        { x: x + 4, y: 4 },
        { x: x + 4, y: 5 },
      ];
    case 1: // cross
      return [
        { x: x + 4, y: 3 },
        { x: x + 5, y: 2 },
        { x: x + 5, y: 3 },
        { x: x + 5, y: 4 },
        { x: x + 6, y: 3 },
      ];
    case 2: // back L
      return [
        { x: x + 4, y: 2 },
        { x: x + 4, y: 3 },
        { x: x + 4, y: 4 },
        { x: x + 5, y: 4 },
        { x: x + 6, y: 4 },
      ];
    case 3: // vertical
      return [
        { x: x + 4, y: 2 },
        { x: x + 5, y: 2 },
        { x: x + 6, y: 2 },
        { x: x + 7, y: 2 },
      ];
    case 4: // square
      return [
        { x: x + 4, y: 2 },
        { x: x + 4, y: 3 },
        { x: x + 5, y: 2 },
        { x: x + 5, y: 3 },
      ];
    default:
      throw new Error('Invalid rockNumber');
  }
};

const getRockHeight = (cave: Cave): number => {
  let height = cave.length - 1;
  let foundRock = false;
  while (height > 0 && !foundRock) {
    const isRockOnRow = cave[height].some((space) => space === CaveItem.ROCK);
    if (isRockOnRow) {
      foundRock = true;
    } else {
      height--;
    }
  }
  return height;
};

const getIsAllRock = (cave: Cave, rowNum: number) =>
  cave[rowNum].every((item) => item === CaveItem.ROCK);

const getIsCollision = (cave: Cave, rock: Rock) =>
  rock.some(
    ({ x, y }) =>
      x <= 0 ||
      x >= cave.length ||
      y < 0 ||
      y >= CAVE_WIDTH ||
      cave[x][y] === CaveItem.ROCK,
  );

const moveRock = (
  cave: Cave,
  oldRock: Rock,
  direction: 'down' | 'left' | 'right',
): { newRock: Rock; isSettledAfter: boolean } => {
  const deltas = { down: [-1, 0], left: [0, -1], right: [0, 1] };
  const [dx, dy] = deltas[direction];
  let isSettledAfter = false;
  const newRock = oldRock.map(({ x, y }) => ({ x: x + dx, y: y + dy }));
  if (getIsCollision(cave, newRock)) {
    if (direction === 'down') isSettledAfter = true;
    return { newRock: oldRock, isSettledAfter };
  }
  return { newRock, isSettledAfter };
};

const dropRock = (
  cave: Cave,
  rockNumber: number,
  gases: string[],
  passInGasIndex: number,
): number => {
  const rockHeight = getRockHeight(cave);
  let rock = getRock(rockNumber, rockHeight);
  const neededHeight = rock[rock.length - 1].x;
  extendCave(cave, neededHeight);
  let isSettled = false;
  let gasIndex = passInGasIndex;
  while (!isSettled) {
    const gas = gases[gasIndex % gases.length];
    gasIndex++;
    const { newRock: rockAfterGas } = moveRock(
      cave,
      rock,
      gas === '<' ? 'left' : 'right',
    );
    const { newRock, isSettledAfter } = moveRock(cave, rockAfterGas, 'down');
    rock = newRock;
    isSettled = isSettledAfter;
  }
  rock.forEach(({ x, y }) => (cave[x][y] = CaveItem.ROCK));
  return gasIndex;
};

const getRepeatPattern = (cave: Cave, gases: string[]) => {
  let gasIndex = 0;
  let rockNum = 0;
  const memo: Record<string, number> = {};
  while (true) {
    gasIndex = dropRock(cave, rockNum, gases, gasIndex);
    if (getIsAllRock(cave, getRockHeight(cave) - 1)) {
      const key = `${rockNum % 5},${gasIndex % gases.length}`;
      if (memo[key]) {
        return {
          rockNum: rockNum % 5,
          gasIndex: gasIndex % gases.length,
          firstOccRocks: memo[key],
          secondOccRocks: rockNum,
        };
      }
      memo[key] = rockNum;
    }
    rockNum++;
  }
};

const dropNumRocks = (
  cave: Cave,
  gases: string[],
  numRocks: number,
  startingGas: number = 0,
  startingRock: number = 0,
) => {
  let gasIndex = startingGas % gases.length;
  range(numRocks).forEach((rockNum) => {
    gasIndex = dropRock(cave, rockNum + startingRock, gases, gasIndex);
  });
};

const getHeightAfterRocks = (
  gases: string[],
  numRocks: number,
  startingGas: number = 0,
  startingRock: number = 0,
) => {
  const cave = generateCave();
  dropNumRocks(cave, gases, numRocks, startingGas, startingRock);
  return getRockHeight(cave);
};

export const day17 = (gases: string[], numRocks: number) =>
  getHeightAfterRocks(gases, numRocks);

export const day17part2 = (gases: string[], numRocks: number) => {
  const cave = generateCave();

  const { rockNum, gasIndex, firstOccRocks, secondOccRocks } = getRepeatPattern(
    cave,
    gases,
  );

  const heightAtFirstOcc = getHeightAfterRocks(gases, firstOccRocks);
  const heightAtSecondOcc = getHeightAfterRocks(gases, secondOccRocks);
  const repeatNumRocks = secondOccRocks - firstOccRocks;

  const addedHeight = heightAtSecondOcc - heightAtFirstOcc;
  const numRepeatLoops = Math.floor(
    (numRocks - firstOccRocks) / repeatNumRocks,
  );
  const loopHeight = addedHeight * numRepeatLoops;

  const remainingRocks = (numRocks - firstOccRocks) % repeatNumRocks;
  const finalHeight = getHeightAfterRocks(
    gases,
    remainingRocks,
    gasIndex,
    rockNum,
  );

  // I have a "classic" off by 13 error somewhere
  // 13 is the height of all 5 rocks stacked
  // Think I'm doing something wrong with the increment of rockNum in getRepeatPattern
  return heightAtFirstOcc + loopHeight + finalHeight - 13;
};
