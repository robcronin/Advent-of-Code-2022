import { Coords } from '../utils/grid';
import { range } from '../utils/looping';

type Sensor = {
  sensor: Coords;
  closestBeacon: Coords;
};
type InvalidRange = [number, number];

const parseSensors = (input: string[]): Sensor[] =>
  input.map((line) => {
    const groups = line.match(
      new RegExp(
        'Sensor at x=(-?[0-9]+), y=(-?[0-9]+): closest beacon is at x=(-?[0-9]+), y=(-?[0-9]+)',
      ),
    );
    if (!groups) throw new Error(`Invalid sensor: ${line}`);
    const [_, sx, sy, bx, by] = groups;
    return { sensor: { x: +sx, y: +sy }, closestBeacon: { x: +bx, y: +by } };
  });

const getManhattanDistance = (coordA: Coords, coordB: Coords) => {
  const { x: ax, y: ay } = coordA;
  const { x: bx, y: by } = coordB;
  return Math.abs(ax - bx) + Math.abs(ay - by);
};

const getInvalidRanges = (sensors: Sensor[], lineNum: number): InvalidRange[] =>
  sensors.reduce((invalidRanges: InvalidRange[], { sensor, closestBeacon }) => {
    const distance = getManhattanDistance(sensor, closestBeacon);
    const { x: sx } = sensor;
    const verticalDistance = getManhattanDistance(sensor, {
      x: sx,
      y: lineNum,
    });
    const horizontalDistance = distance - verticalDistance;
    if (horizontalDistance >= 0) {
      if (lineNum !== closestBeacon.y) {
        return [
          ...invalidRanges,
          [sx - horizontalDistance, sx + horizontalDistance],
        ];
      } else if (horizontalDistance > 0) {
        if (sx - horizontalDistance === closestBeacon.x) {
          return [
            ...invalidRanges,
            [sx - horizontalDistance + 1, sx + horizontalDistance],
          ];
        } else {
          return [
            ...invalidRanges,
            [sx - horizontalDistance, sx + horizontalDistance - 1],
          ];
        }
      }
    }
    return invalidRanges;
  }, []);

const getNonLappingInvalidRanges = (invalidRanges: InvalidRange[]) => {
  const sortedRanges = invalidRanges.sort((a, b) => a[0] - b[0]);
  let lastReturned = sortedRanges[0];
  const nonLappingInvalidRanges = sortedRanges
    .map((range, index) => {
      if (index === 0) return range;
      const newReturned: [number, number] = [
        Math.max(lastReturned[1] + 1, range[0]),
        Math.max(lastReturned[1], range[1]),
      ];
      lastReturned = newReturned;
      return newReturned;
    })
    .filter((range) => range[0] <= range[1]);

  return nonLappingInvalidRanges;
};

const getRangeLength = (nonLappingInvalidRanges: InvalidRange[]) => {
  const numInvalid = nonLappingInvalidRanges.reduce((sum, range) => {
    return sum + range[1] - range[0] + 1;
  }, 0);

  return numInvalid;
};

const getNumInvalidPositions = (sensors: Sensor[], lineNum: number) => {
  const invalidRanges = getInvalidRanges(sensors, lineNum);
  const nonLappingInvalidRanges = getNonLappingInvalidRanges(invalidRanges);
  return getRangeLength(nonLappingInvalidRanges);
};

const getTrimmedRanges = (
  invalidRanges: InvalidRange[],
  maxVal: number,
): InvalidRange[] => {
  const nonLappingInvalidRanges = getNonLappingInvalidRanges(invalidRanges);
  return nonLappingInvalidRanges
    .map((range) => {
      const [x, y] = range;
      return [Math.max(x, 0), Math.min(y, maxVal)] as [number, number];
    })
    .filter((range) => range[0] <= range[1]);
};

const getBeacons = (sensors: Sensor[]) =>
  sensors.map(({ closestBeacon }) => closestBeacon);

const getBeaconsByLine = (beacons: Coords[], lineNum: number) =>
  beacons.filter((beacon) => beacon.y === lineNum);

const addBeacons = (invalidRanges: InvalidRange[], beacons: Coords[]) =>
  beacons.reduce((acc: InvalidRange[], beacon) => {
    const beaconRange: InvalidRange = [beacon.x, beacon.x];
    return [...acc, beaconRange];
  }, invalidRanges);

const getAvailableBeacon = (sensors: Sensor[], maxVal: number) => {
  const beacons = getBeacons(sensors);
  let x;
  const y = range(0, maxVal + 1).find((lineNum) => {
    const invalidRanges = getInvalidRanges(sensors, lineNum);
    const beaconsOnLine = getBeaconsByLine(beacons, lineNum);
    const invalidWithBeaconRanges = addBeacons(invalidRanges, beaconsOnLine);
    const trimmedRanges = getTrimmedRanges(invalidWithBeaconRanges, maxVal);

    const rangeLength = getRangeLength(trimmedRanges);
    if (rangeLength !== maxVal + 1) {
      x = range(0, maxVal + 1).find((potX) => {
        const isXinRange = trimmedRanges.some(
          ([a, b]) => potX >= a && potX <= b,
        );
        return !isXinRange;
      });
      return true;
    }
  });
  if (!x || !y) throw new Error('No beacon found');
  return { x, y };
};

export const day15 = (input: string[], lineNum: number) => {
  const sensors = parseSensors(input);
  return getNumInvalidPositions(sensors, lineNum);
};

export const day15part2 = (input: string[], maxVal: number) => {
  const sensors = parseSensors(input);
  const { x, y } = getAvailableBeacon(sensors, maxVal);

  return 4000000 * x + y;
};
