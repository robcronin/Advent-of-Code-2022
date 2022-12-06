import { range } from '../utils/looping';

type Crates = string[][];
type Move = {
  numCratesToMove: number;
  fromStack: number;
  toStack: number;
};

const parseCrates = (startingCrates: string): Crates => {
  const starting = startingCrates.split('\n').reverse();
  const [markers, ...crateString] = starting;
  const numStacks = Number(markers.split('   ').pop());
  const crates: Crates = Array.from({ length: numStacks }, (v, i) => []);
  crateString.forEach((line) => {
    for (let i = 0; i <= line.length; i += 4) {
      const crate = line.slice(i + 1, i + 2);
      if (crate !== ' ') {
        crates[i / 4].push(crate);
      }
    }
  });
  return crates;
};

const parseMoves = (movesString: string): Move[] =>
  movesString.split('\n').map((moveString) => {
    const groups = moveString.match(
      new RegExp('^move ([0-9]+) from ([0-9]+) to ([0-9]+)$'),
    );
    if (!groups) throw new Error(`Invalid moveString: ${moveString}`);
    const [_, numCratesToMove, fromStack, toStack] = groups;
    return {
      numCratesToMove: +numCratesToMove,
      fromStack: +fromStack,
      toStack: +toStack,
    };
  });

const parseCrateInput = (input: string) => {
  const [startingCrates, movesString] = input.split('\n\n');
  const crates = parseCrates(startingCrates);
  const moves = parseMoves(movesString);
  return { crates, moves };
};

const runMovesInPlaceSingle = (crates: Crates, moves: Move[]) => {
  moves.forEach(({ numCratesToMove, fromStack, toStack }) => {
    range(numCratesToMove).forEach(() => {
      const movingCrate = crates[fromStack - 1].pop();
      if (!movingCrate) throw new Error('Tried to pop non existant crate');
      crates[toStack - 1].push(movingCrate);
    });
  });
};

const runMovesInPlaceMultiple = (crates: Crates, moves: Move[]) => {
  moves.forEach(({ numCratesToMove, fromStack, toStack }) => {
    const cratesToMove = range(numCratesToMove).reduce(
      (cratesToMove: string[]) => {
        const movingCrate = crates[fromStack - 1].pop();
        if (!movingCrate) throw new Error('Tried to pop non existant crate');
        return [...cratesToMove, movingCrate];
      },
      [],
    );
    cratesToMove.reverse().forEach((crate) => crates[toStack - 1].push(crate));
  });
};

const genMessageTop = (crates: Crates) =>
  crates.reduce((message, stack) => message + stack[stack.length - 1], '');

export const day5 = (input: string) => {
  const { crates, moves } = parseCrateInput(input);
  runMovesInPlaceSingle(crates, moves);
  const message = genMessageTop(crates);

  return message;
};

export const day5part2 = (input: string) => {
  const { crates, moves } = parseCrateInput(input);
  runMovesInPlaceMultiple(crates, moves);
  const message = genMessageTop(crates);

  return message;
};
