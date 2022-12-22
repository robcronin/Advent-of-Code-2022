/*
  The cube structure of this answer is hardcoded to the layout of the actual input
  This is a different shape to the test data(and bigger)
*/

import { Coords, genNewGrid, GridInfo, isCoordValid } from '../utils/grid';
import { range } from '../utils/looping';

enum GridItem {
  EMPTY = ' ',
  PATH = '.',
  WALL = '#',
}
type Rotation = 'L' | 'R';
type PathStep =
  | { steps: number; rotation: undefined }
  | { steps: undefined; rotation: Rotation };
type Path = PathStep[];
type Direction = [number, number];
const directions: Direction[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const parseNotes = (input: string[]) => {
  const inputString = [...input];
  const pathString = inputString.pop() as string;
  inputString.pop();
  const mapString = inputString.map((line) => line.split(''));

  const numRows = mapString.length;
  const numCols = mapString.reduce(
    (max, line) => Math.max(max, line.length),
    0,
  );
  const gridInfo = genNewGrid({
    numRows,
    numCols,
    defaultValue: GridItem.EMPTY,
  });

  range(numRows).forEach((x) => {
    const line = mapString[x];
    range(numCols).forEach((y) => {
      const value = (line[y] ?? GridItem.EMPTY) as GridItem;
      gridInfo.grid[x][y] = value;
    });
  });

  const pathNums = pathString.split(/R|L/);
  const pathDirs = pathString.split(/[0-9]+/);
  const path: Path = pathNums.reduce((acc: PathStep[], num, index) => {
    return [
      ...acc,
      { steps: +num, rotation: undefined },
      ...(pathDirs[index + 1]
        ? [
            {
              rotation: pathDirs[index + 1] as Rotation,
              steps: undefined,
            },
          ]
        : []),
    ];
  }, []);

  return { gridInfo, path };
};

const getStartPosition = (gridInfo: GridInfo<GridItem>): Coords => {
  const y = gridInfo.grid[0].findIndex((item) => item === GridItem.PATH);
  return { x: 0, y };
};

const getDirection = (directionIndex: number) => {
  let index = directionIndex;
  while (index < 0) index += 4;
  return directions[index % 4];
};

const isOffGrid = (gridInfo: GridInfo<GridItem>, coords: Coords) =>
  !isCoordValid(coords, gridInfo) ||
  gridInfo.grid[coords.x][coords.y] === GridItem.EMPTY;

const getCubeFace = (coords: Coords) => {
  const { x, y } = coords;
  if (x < 50 && y >= 50 && y < 100) return 'A';
  if (x < 50 && y >= 100 && y < 150) return 'B';
  if (x >= 50 && x < 100 && y >= 50 && y < 100) return 'C';
  if (x >= 100 && x < 150 && y < 50) return 'D';
  if (x >= 100 && x < 150 && y >= 50 && y < 100) return 'E';
  if (x >= 150 && x < 200 && y < 50) return 'F';
  throw new Error('Missing Cube Face');
};

// Hardcoded to given data layout
const getCubeOffset = (
  coords: Coords,
  directionIndex: number,
): Coords & { directionIndex: number } => {
  const { x, y } = coords;
  const modX = x % 50;
  const modY = y % 50;
  const modDir = (directionIndex + 4000) % 4;
  const cubeFace = getCubeFace(coords);
  if (cubeFace === 'A') {
    if (modDir === 3) {
      return { x: 150 + modY, y: 0, directionIndex: 0 };
    } else if (modDir === 2) {
      return { x: 100 + (49 - modY), y: 0, directionIndex: 0 };
    }
    throw new Error('A missing');
  } else if (cubeFace === 'B') {
    if (modDir === 3) {
      return { x: 199, y: modY, directionIndex: 3 };
    } else if (modDir === 0) {
      return { x: 100 + (49 - modX), y: 99, directionIndex: 2 };
    } else if (modDir === 1) {
      return { x: 50 + modY, y: 99, directionIndex: 2 };
    }
    throw new Error('B missing');
  } else if (cubeFace === 'C') {
    if (modDir === 0) {
      return { x: 49, y: 100 + modX, directionIndex: 3 };
    } else if (modDir === 2) {
      return { x: 100, y: modX, directionIndex: 1 };
    }
    throw new Error('C missing');
  } else if (cubeFace === 'D') {
    if (modDir === 3) {
      return { x: 50 + modY, y: 50, directionIndex: 0 };
    } else if (modDir === 2) {
      return { x: 49 - modX, y: 50, directionIndex: 0 };
    }
    throw new Error('D missing');
  } else if (cubeFace === 'E') {
    if (modDir === 0) {
      return { x: 49 - modX, y: 149, directionIndex: 2 };
    } else if (modDir === 1) {
      return { x: 150 + modY, y: 49, directionIndex: 2 };
    }
    throw new Error('E missing');
  } else if (cubeFace === 'F') {
    if (modDir === 0) {
      return { x: 149, y: 50 + modX, directionIndex: 3 };
    } else if (modDir === 1) {
      return { x: 0, y: 100 + modY, directionIndex: 1 };
    } else if (modDir === 2) {
      return { x: 0, y: 50 + modX, directionIndex: 1 };
    }
    throw new Error('F missing');
  }
  throw new Error('Cube face missing');
};

const getNextStep = (
  gridInfo: GridInfo<GridItem>,
  coords: Coords,
  isCube: boolean,
  directionIndex: number,
): Coords & { directionIndex?: number } => {
  const { x, y } = coords;
  const [dx, dy] = getDirection(directionIndex);
  const nextCoords = { x: x + dx, y: y + dy };
  if (isOffGrid(gridInfo, nextCoords) && !isCube) {
    let ox = x;
    let oy = y;
    while (
      !isOffGrid(gridInfo, { x: ox, y: oy }) &&
      gridInfo.grid[ox][oy] !== GridItem.EMPTY
    ) {
      ox -= dx;
      oy -= dy;
    }
    if (gridInfo.grid[ox + dx][oy + dy] === GridItem.WALL) {
      return coords;
    }
    return { x: ox + dx, y: oy + dy };
  } else if (isOffGrid(gridInfo, nextCoords) && isCube) {
    const cubeOffset = getCubeOffset(coords, directionIndex);
    if (gridInfo.grid[cubeOffset.x][cubeOffset.y] === GridItem.WALL) {
      return coords;
    }
    return {
      x: cubeOffset.x,
      y: cubeOffset.y,
      directionIndex: cubeOffset.directionIndex,
    };
  } else if (gridInfo.grid[x + dx][y + dy] === GridItem.WALL) {
    return coords;
  }
  return { x: x + dx, y: y + dy };
};

const moveSteps = (
  gridInfo: GridInfo<GridItem>,
  position: Coords,
  directionIndex: number,
  numSteps: number,
  isCube: boolean,
) => {
  let updatedDirectionIndex = directionIndex;
  let endPosition = { ...position };
  range(numSteps).forEach(() => {
    const nextStep = getNextStep(
      gridInfo,
      endPosition,
      isCube,
      updatedDirectionIndex,
    );
    endPosition = { x: nextStep.x, y: nextStep.y };
    if (nextStep.directionIndex !== undefined)
      updatedDirectionIndex = nextStep.directionIndex;
  });
  return {
    x: endPosition.x,
    y: endPosition.y,
    directionIndex: updatedDirectionIndex,
  };
};

const runPath = (gridInfo: GridInfo<GridItem>, path: Path, isCube: boolean) => {
  let position = getStartPosition(gridInfo);
  let directionIndex = 0;
  path.forEach((step) => {
    if (step?.rotation) {
      directionIndex += step.rotation === 'L' ? -1 : 1;
    } else {
      const stepMove = moveSteps(
        gridInfo,
        position,
        directionIndex,
        step.steps,
        isCube,
      );
      position = { x: stepMove.x, y: stepMove.y };
      if (stepMove.directionIndex !== undefined)
        directionIndex = stepMove.directionIndex;
    }
  });
  return { position, directionIndex };
};

const getPassword = (position: Coords, directionIndex: number) =>
  1000 * (position.x + 1) + 4 * (position.y + 1) + ((directionIndex + 4) % 4);

export const day22 = (input: string[]) => {
  const { gridInfo, path } = parseNotes(input);
  const { position, directionIndex } = runPath(gridInfo, path, false);
  return getPassword(position, directionIndex);
};

export const day22part2 = (input: string[]) => {
  const { gridInfo, path } = parseNotes(input);
  const { position, directionIndex } = runPath(gridInfo, path, true);
  return getPassword(position, directionIndex);
};
