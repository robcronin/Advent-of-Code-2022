import { range } from '../utils/looping';

type Direction = 'R' | 'U' | 'L' | 'D';
type Movement = {
  direction: Direction;
  steps: number;
};
type Location = [number, number];

const directionsDelta: Record<Direction, [number, number]> = {
  R: [1, 0],
  U: [0, 1],
  L: [-1, 0],
  D: [0, -1],
};

const parseMovements = (input: string[]): Movement[] =>
  input.map((movement) => {
    const [direction, stepsString] = movement.split(' ');
    return { direction: direction as Direction, steps: +stepsString };
  });

const getPlanckDistance = (prevKnot: Location, knot: Location) =>
  Math.max(Math.abs(prevKnot[0] - knot[0]), Math.abs(prevKnot[1] - knot[1]));

const getAllPlanckDistances = (head: Location, knots: Location[]) =>
  knots.map((knot, index) => {
    const prevKnot = index === 0 ? head : knots[index - 1];
    return getPlanckDistance([prevKnot[0], prevKnot[1]], [knot[0], knot[1]]);
  });

const getMaxPlanckDistances = (planckDistances: number[]) =>
  planckDistances.reduce((max, distance) => Math.max(max, distance), 0);

const moveRope = (
  movements: Movement[],
  tailLength: number,
  maxAllowedDistance: number = 1,
) => {
  const head: Location = [0, 0];
  const knots: Location[] = Array.from(Array(tailLength)).map(() => [0, 0]);

  const tailLocations = new Set<string>();
  tailLocations.add('0,0');

  movements.forEach(({ direction, steps }) => {
    const [dx, dy] = directionsDelta[direction];
    range(steps).forEach(() => {
      head[0] += dx;
      head[1] += dy;

      let planckDistances = getAllPlanckDistances(head, knots);
      let maxPlanckDistance = getMaxPlanckDistances(planckDistances);
      while (maxPlanckDistance > maxAllowedDistance) {
        knots.forEach((knot, index) => {
          const prevKnot = index === 0 ? head : knots[index - 1];
          const planckDistance = planckDistances[index];

          if (planckDistance > maxAllowedDistance) {
            const knotDy = prevKnot[1] > knot[1] ? 1 : -1;
            const knotDx = prevKnot[0] > knot[0] ? 1 : -1;

            if (prevKnot[0] === knot[0]) {
              knot[1] += knotDy;
            } else if (prevKnot[1] === knot[1]) {
              knot[0] += knotDx;
            } else {
              knot[1] += knotDy;
              knot[0] += knotDx;
            }
            tailLocations.add(
              `${knots[knots.length - 1][0]},${knots[knots.length - 1][1]}`,
            );
          }
        });

        planckDistances = getAllPlanckDistances(head, knots);
        maxPlanckDistance = getMaxPlanckDistances(planckDistances);
      }
    });
  });
  return tailLocations;
};

export const day9 = (input: string[]) => {
  const movements = parseMovements(input);
  const tailLocations = moveRope(movements, 1);
  return tailLocations.size;
};

export const day9part2 = (input: string[]) => {
  const movements = parseMovements(input);
  const tailLocations = moveRope(movements, 9);
  return tailLocations.size;
};
