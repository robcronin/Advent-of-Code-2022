import { parseInput } from '../utils/input';
import { range } from '../utils/looping';

class Troop {
  private monkeys: Monkey[] = [];
  private mod: number;

  constructor(input: string[], lowerWorry: boolean) {
    input.forEach((line) => {
      const monkeyInfo = parseInput(line) as string[];
      const monkey = new Monkey(monkeyInfo, lowerWorry);
      this.monkeys.push(monkey);
    });
    this.mod = this.monkeys.reduce(
      (mod: number, monkey) => mod * monkey.getDivisor(),
      1,
    );
  }

  private getNumInspections = () =>
    this.monkeys.map((monkey) => monkey.getNumInspections());

  private runRound = () => {
    this.monkeys.forEach((monkey) => {
      const newMonkeys = monkey.inspectAllItems(this.mod);
      newMonkeys.forEach(({ newMonkey, worry }) => {
        this.monkeys[newMonkey].receiveItem(worry);
      });
    });
  };

  public runRounds = (numRounds: number) =>
    range(numRounds).forEach(() => this.runRound());

  public getMonkeyBusiness = () => {
    const numInspections = this.getNumInspections();
    const sortedInspections = numInspections.sort((a, b) => b - a);
    return sortedInspections[0] * sortedInspections[1];
  };
}

class Monkey {
  private items: number[];
  private op: (worry: number) => number;
  private divisor: number;
  private test: (worry: number) => boolean;
  private trueMonkey: number;
  private falseMonkey: number;
  private getThrowTo: (worry: number) => number;
  private numInspections: number = 0;
  private lowerWorry: boolean;

  constructor(monkeyInfo: string[], lowerWorry: boolean) {
    this.lowerWorry = lowerWorry;

    const [_num, itemsLine, opLine, testString, trueString, falseString] =
      monkeyInfo;

    const itemString = itemsLine.slice('Starting items: '.length);
    this.items = parseInput(itemString, ', ') as number[];

    const opString = opLine.slice('Operation: '.length);
    const groups = opString.match(
      new RegExp('^new = (old|[0-9]+) (\\*|\\+) (old|[0-9]+)$'),
    );
    if (!groups) throw new Error(`opString not valid: ${opString}`);
    const [_, x, operation, y] = groups;
    this.op = (worry: number) => {
      const a = x === 'old' ? worry : +x;
      const b = y === 'old' ? worry : +y;
      if (operation === '*') return a * b;
      return a + b;
    };

    this.divisor = +testString.slice('Test: divisible by '.length);
    this.test = (worry: number) => worry % this.divisor === 0;

    this.trueMonkey = +trueString.slice('If true: throw to monkey'.length);
    this.falseMonkey = +falseString.slice('If false: throw to monkey'.length);

    this.getThrowTo = (worry: number) =>
      this.test(worry) ? this.trueMonkey : this.falseMonkey;
  }

  public getNumInspections = () => this.numInspections;
  public getItems = () => [...this.items];
  public getDivisor = () => this.divisor;

  private inspectItem = (item: number, mod: number) => {
    const inspectWorryLevel = this.op(item);
    const postInspectWorryLevel = this.lowerWorry
      ? Math.floor(inspectWorryLevel / 3)
      : inspectWorryLevel % mod;
    const newMonkey = this.getThrowTo(postInspectWorryLevel);
    this.numInspections++;

    return { newMonkey, worry: postInspectWorryLevel };
  };

  public inspectAllItems = (mod: number) => {
    const newMonkeys = this.items.map((item) => this.inspectItem(item, mod));
    this.items = [];
    return newMonkeys;
  };

  public receiveItem = (item: number) => this.items.push(item);
}

export const day11 = (input: string[]) => {
  const troop = new Troop(input, true);
  troop.runRounds(20);
  return troop.getMonkeyBusiness();
};
export const day11part2 = (input: string[]) => {
  const troop = new Troop(input, false);
  troop.runRounds(10000);
  return troop.getMonkeyBusiness();
};
