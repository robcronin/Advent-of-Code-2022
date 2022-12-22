type Operation = '+' | '-' | '*' | '/';
type Memo = Record<string, number | boolean>;
type Monkey =
  | {
      id: string;
      simpleNum: number;
      monkeyA: undefined;
      monkeyB: undefined;
      operation: undefined;
      isSimple: true;
      isOperation: false;
      value: number;
      isRoot: false;
    }
  | {
      id: string;
      simpleNum: undefined;
      monkeyA: string;
      monkeyB: string;
      operation: Operation;
      isSimple: false;
      isOperation: true;
      value?: number;
      isRoot: boolean;
    };
type Monkeys = Record<string, Monkey>;

const parseMonkeys = (input: string[]): Monkeys =>
  input
    .map((line) => {
      const groups = line.match(
        new RegExp(
          '^([a-z]+): (([0-9]+)|([a-z]+) (\\+|\\-|\\*|\\/) ([a-z]+))$',
        ),
      );
      if (!groups) throw new Error(`line is invalid: ${line}`);
      const [_, id, _a, simpleNum, monkeyA, operation, monkeyB] = groups;
      return {
        id,
        simpleNum: simpleNum ? +simpleNum : undefined,
        monkeyA,
        monkeyB,
        operation: operation as Operation,
        isSimple: !!simpleNum,
        isOperation: !!operation,
        value: simpleNum ? +simpleNum : undefined,
        isRoot: id === 'root',
      };
    })
    .reduce((acc, monkey) => ({ ...acc, [monkey.id]: monkey }), {});

const runMonkeyScream = (
  memo: Record<string, number | boolean>,
  monkeys: Monkeys,
  monkeyId: string,
  rootCheck?: boolean,
): number | boolean => {
  if (memo[monkeyId]) return memo[monkeyId];
  const monkey = monkeys[monkeyId];
  let value: number | boolean = 0;
  if (monkey.value) value = monkey.value;
  if (monkey.isOperation) {
    const monkeyAValue = runMonkeyScream(
      memo,
      monkeys,
      monkey.monkeyA,
      rootCheck,
    );
    const monkeyBValue = runMonkeyScream(
      memo,
      monkeys,
      monkey.monkeyB,
      rootCheck,
    );

    if (monkey.isRoot && rootCheck) {
      value = monkeyAValue === monkeyBValue;
    } else {
      if (
        typeof monkeyAValue === 'boolean' ||
        typeof monkeyBValue === 'boolean'
      ) {
        throw new Error('aah');
      }
      switch (monkey.operation) {
        case '+':
          value = monkeyAValue + monkeyBValue;
          break;
        case '-':
          value = monkeyAValue - monkeyBValue;
          break;
        case '*':
          value = monkeyAValue * monkeyBValue;
          break;
        case '/':
          value = monkeyAValue / monkeyBValue;
          break;
      }
    }
  }

  memo[monkeyId] = value;
  return value;
};

const getAllMonkeyValues = (
  monkeys: Monkeys,
  rootCheck?: boolean,
  humnValue?: number,
) => {
  let memo: Memo = {};
  if (humnValue) monkeys['humn'].value = humnValue;
  runMonkeyScream(memo, monkeys, 'root', rootCheck);
  return memo;
};

const getMonkeyValue = (
  monkeys: Monkeys,
  monkeyId: string,
  rootCheck?: boolean,
  humnValue?: number,
) => getAllMonkeyValues(monkeys, rootCheck, humnValue)[monkeyId];

const getAffectedHumnMonkeyInfo = (monkeys: Monkeys) => {
  const rootA = monkeys['root'].monkeyA as string;
  const rootB = monkeys['root'].monkeyB as string;

  const initialMonkeys = getAllMonkeyValues(monkeys, true, 0);
  const initialA = initialMonkeys[rootA];
  const initialB = initialMonkeys[rootB];
  const secondA = getAllMonkeyValues(monkeys, true, 100000)[rootA];

  const affectedMonkey = initialA === secondA ? rootB : rootA;
  const targetValue = initialA === secondA ? initialA : initialB;
  return { affectedMonkey, targetValue };
};

const binarySearchHumnValue = (
  monkeys: Monkeys,
  affectedMonkey: string,
  targetValue: number,
) => {
  let minHumn = 0;
  let midHumn = Math.floor(Number.MAX_SAFE_INTEGER / 2);
  let maxHumn = Number.MAX_SAFE_INTEGER;
  let minTarget = getMonkeyValue(monkeys, affectedMonkey, true, minHumn);
  let midTarget = getMonkeyValue(monkeys, affectedMonkey, true, midHumn);
  let maxTarget = getMonkeyValue(monkeys, affectedMonkey, true, maxHumn);
  let increasing = maxTarget > minTarget;

  while (midTarget !== targetValue) {
    if (
      (increasing && midTarget < targetValue) ||
      (!increasing && midTarget > targetValue)
    ) {
      minHumn = midHumn;
      minTarget = midTarget;
      midHumn = Math.floor((maxHumn - midHumn) / 2) + midHumn;
      midTarget = getMonkeyValue(monkeys, affectedMonkey, true, midHumn);
    } else {
      maxHumn = midHumn;
      maxTarget = midTarget;
      midHumn = Math.ceil(midHumn / 2);
      midTarget = getMonkeyValue(monkeys, affectedMonkey, true, midHumn);
    }
  }
  return midHumn;
};

export const day21 = (input: string[]) => {
  const monkeys = parseMonkeys(input);
  return getMonkeyValue(monkeys, 'root', false);
};

export const day21part2 = (input: string[]) => {
  const monkeys = parseMonkeys(input);
  const { affectedMonkey, targetValue } = getAffectedHumnMonkeyInfo(monkeys);
  return binarySearchHumnValue(monkeys, affectedMonkey, targetValue);
};
