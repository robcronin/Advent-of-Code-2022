import { sumArr } from '../utils/array';
import { parseLines } from '../utils/input';

export const parseCalories = (input: string) => {
  const elfCalories = parseLines(input, '\n\n');
  return elfCalories.map((elf) => elf.split('\n').map(Number));
};

const getSortedCalories = (input: number[][]) => {
  const summedCalories = input.map((elf) => sumArr(elf, (calorie) => calorie));
  return summedCalories.sort((a, b) => b - a);
};

export const day1 = (input: number[][]) => {
  const sortedCalories = getSortedCalories(input);
  return sortedCalories[0];
};
export const day1part2 = (input: number[][]) => {
  const sortedCalories = getSortedCalories(input);
  return sortedCalories[0] + sortedCalories[1] + sortedCalories[2];
};
