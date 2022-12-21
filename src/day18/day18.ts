import { countArr } from '../utils/array';
import {
  Coords3d,
  directions3d,
  genNew3dGrid,
  getNeighbourCoords3d,
  GridInfo3d,
  isCoordValid3d,
} from '../utils/grid3d';
import { range } from '../utils/looping';

enum GridItem {
  LAVA = '#',
  EMPTY = '.',
  EMPTY_INTERIOR = '.i',
  EMPTY_EXTERIOR = '.e',
  WALL = '|',
}

const parseCubes = (input: string[]): Coords3d[] =>
  input.map((line) => {
    const [x, y, z] = line.split(',');
    return { x: +x + 1, y: +y + 1, z: +z + 1 }; // add a 0 wall
  });

const getDimenions = (cubes: Coords3d[]) =>
  cubes.reduce(
    ({ maxX, maxY, maxZ }, { x, y, z }) => ({
      maxX: Math.max(maxX, x),
      maxY: Math.max(maxY, y),
      maxZ: Math.max(maxZ, z),
    }),
    { maxX: 0, maxY: 0, maxZ: 0 },
  );

const fillGrid = (input: string[]): GridInfo3d<GridItem> => {
  const cubes = parseCubes(input);
  const { maxX, maxY, maxZ } = getDimenions(cubes);
  const gridInfo3d = genNew3dGrid({
    // create buffer to be able to check edges
    numRows: maxX + 2,
    numCols: maxY + 2,
    numDips: maxZ + 2,
    defaultValue: GridItem.EMPTY,
  });
  cubes.forEach(({ x, y, z }) => (gridInfo3d.grid[x][y][z] = GridItem.LAVA));
  [0, maxX + 2 - 1].forEach((x) => {
    [0, maxY + 2 - 1].forEach((y) => {
      [0, maxZ + 2 - 1].forEach((z) => {
        gridInfo3d.grid[x][y][z] = GridItem.WALL;
      });
    });
  });
  return gridInfo3d;
};

const checkNeighboursForWall = (
  gridInfo3d: GridInfo3d<GridItem>,
  location: Coords3d,
  visitedSet: Set<string>,
): undefined | GridItem => {
  let foundItem: GridItem | undefined;
  const { x, y, z } = location;
  const { grid } = gridInfo3d;

  directions3d.forEach((direction) => {
    const [dx, dy, dz] = direction;
    const next = { x: x + dx, y: y + dy, z: z + dz };
    if (isCoordValid3d(next, gridInfo3d)) {
      const visitKey = `${next.x},${next.y},${next.z}`;
      if (
        grid[next.x][next.y][next.z] !== GridItem.LAVA &&
        !visitedSet.has(visitKey)
      ) {
        if (grid[next.x][next.y][next.z] === GridItem.WALL) {
          foundItem = GridItem.WALL;
        } else {
          visitedSet.add(visitKey);
          foundItem =
            foundItem || checkNeighboursForWall(gridInfo3d, next, visitedSet);
        }
      }
    }
  });
  return foundItem;
};

const findIfExeterior = (
  gridInfo3d: GridInfo3d<GridItem>,
  coords3d: Coords3d,
): boolean => {
  const { x, y, z } = coords3d;
  if (gridInfo3d.grid[x][y][z] === GridItem.EMPTY_INTERIOR) return false;
  if (gridInfo3d.grid[x][y][z] === GridItem.EMPTY_EXTERIOR) return true;

  const visitedSet = new Set<string>();
  const isExterior = !!checkNeighboursForWall(gridInfo3d, coords3d, visitedSet);
  visitedSet.forEach((visitString) => {
    const [x, y, z] = visitString.split(',');
    gridInfo3d.grid[+x][+y][+z] = isExterior
      ? GridItem.EMPTY_EXTERIOR
      : GridItem.EMPTY_INTERIOR;
  });
  return isExterior;
};

const getSurfaceArea = (
  gridInfo3d: GridInfo3d<GridItem>,
  exteriorOnly: boolean,
) => {
  const { numRows, numCols, numDips, grid } = gridInfo3d;
  let surfaceArea = 0;
  range(numRows).forEach((x) => {
    range(numCols).forEach((y) => {
      range(numDips).forEach((z) => {
        if (grid[x][y][z] !== GridItem.LAVA) {
          if (!exteriorOnly || findIfExeterior(gridInfo3d, { x, y, z })) {
            const neighbours = getNeighbourCoords3d({
              coords: { x, y, z },
              gridInfo3d,
            });

            const surfaces = countArr(
              neighbours,
              (n) => grid[n.x][n.y][n.z] === GridItem.LAVA,
            );
            surfaceArea += surfaces;
          }
        }
      });
    });
  });
  return surfaceArea;
};

export const day18 = (input: string[]) => {
  const gridInfo3d = fillGrid(input);
  const surfaceArea = getSurfaceArea(gridInfo3d, false);
  return surfaceArea;
};
export const day18part2 = (input: string[]) => {
  const gridInfo3d = fillGrid(input);
  const surfaceArea = getSurfaceArea(gridInfo3d, true);
  return surfaceArea;
};
