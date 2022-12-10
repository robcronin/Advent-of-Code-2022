import { genNewGrid, printGrid } from '../utils/grid';

type Operation =
  | {
      instruction: 'noop';
    }
  | {
      instruction: 'addx';
      value: number;
    };

const parseOperations = (input: string[]): Operation[] =>
  input.map((operation) => {
    const [instruction, value] = operation.split(' ');
    if (instruction === 'noop') return { instruction: 'noop' };
    return { instruction: 'addx', value: +value };
  });

const findInterestingSignal = (operations: Operation[]) => {
  let signalStrength = 0;
  operations.reduce(
    ({ x, numCycles }, op) => {
      if (op.instruction === 'noop') {
        if (numCycles % 40 === 19) signalStrength += x * (numCycles + 1);
        return { x, numCycles: numCycles + 1 };
      } else {
        if (numCycles % 40 === 19) signalStrength += x * (numCycles + 1);
        else if (numCycles % 40 === 18) signalStrength += x * (numCycles + 2);
        return { x: x + op.value, numCycles: numCycles + 2 };
      }
    },
    { x: 1, numCycles: 0 },
  );
  return signalStrength;
};

const findCrtImage = (operations: Operation[]) => {
  const gridInfo = genNewGrid({ numRows: 6, numCols: 40, defaultValue: '.' });
  const { grid } = gridInfo;
  operations.reduce(
    ({ register, numCycles }, op) => {
      const x = Math.floor(numCycles / 40);
      const y = numCycles % 40;
      const sprite = [register - 1, register, register + 1];

      if (op.instruction === 'noop') {
        if (sprite.includes(y)) grid[x][y] = '#';
        return { register, numCycles: numCycles + 1 };
      } else {
        if (sprite.includes(y)) grid[x][y] = '#';
        if (y + 1 < 40 && sprite.includes(y + 1)) grid[x][y + 1] = '#';
        else if (y + 1 === 40 && sprite.includes(0)) grid[x + 1][0] = '#';
        return { register: register + op.value, numCycles: numCycles + 2 };
      }
    },
    { register: 1, numCycles: 0 },
  );

  return printGrid(gridInfo);
};

export const day10 = (input: string[]) => {
  const operations = parseOperations(input);
  return findInterestingSignal(operations);
};
export const day10part2 = (input: string[]) => {
  const operations = parseOperations(input);
  return findCrtImage(operations);
};
