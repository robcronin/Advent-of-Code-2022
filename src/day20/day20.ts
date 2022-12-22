import { sumArr } from '../utils/array';
import { range } from '../utils/looping';

const getNewIndex = (
  currentIndex: number,
  steps: number,
  numValues: number,
) => {
  let newIndex = currentIndex;
  let remainingSteps = Math.abs(steps) % (numValues - 1);
  if (steps > 0) {
    if (remainingSteps + currentIndex > numValues - 1) {
      return currentIndex + remainingSteps - (numValues - 1);
    } else {
      return currentIndex + remainingSteps;
    }
  } else if (steps < 0) {
    if (currentIndex - remainingSteps < 0) {
      return numValues - 1 - (remainingSteps - currentIndex);
    } else {
      return currentIndex - remainingSteps;
    }
  }
  return newIndex;
};

const getNewIndexOrder = (
  currentIndex: number,
  newIndex: number,
  index: number,
  indexes: number[],
) => {
  if (newIndex > currentIndex) {
    return [
      ...indexes.slice(0, currentIndex),
      ...indexes.slice(currentIndex + 1, newIndex + 1),
      index,
      ...indexes.slice(newIndex + 1),
    ];
  } else if (newIndex < currentIndex) {
    return [
      ...indexes.slice(0, newIndex),
      index,
      ...indexes.slice(newIndex, currentIndex),
      ...indexes.slice(currentIndex + 1),
    ];
  }
  return indexes;
};

const mixNumber = (steps: number, index: number, indexes: number[]) => {
  const numValues = indexes.length;
  const currentIndex = indexes.findIndex((i) => i === index);
  if (currentIndex === undefined) throw new Error("Can't find index");
  const newIndex = getNewIndex(currentIndex, steps, numValues);
  return getNewIndexOrder(currentIndex, newIndex, index, indexes);
};

const runMix = (numbers: number[], indexes: number[]) => {
  numbers.forEach((steps, index) => {
    indexes = mixNumber(steps, index, indexes);
  });
  return indexes;
};

const runNumMixes = (input: number[], numMixes: number) => {
  let indexes = [...Array(input.length).keys()];
  range(numMixes).forEach(() => {
    indexes = runMix(input, indexes);
  });
  const mixedNumbers = indexes.map((index) => input[index]);
  return mixedNumbers;
};

const getGroveCoordinates = (numbers: number[]) => {
  const zeroIndex = numbers.findIndex((m) => m === 0);
  return [
    numbers[(1000 + zeroIndex) % numbers.length],
    numbers[(2000 + zeroIndex) % numbers.length],
    numbers[(3000 + zeroIndex) % numbers.length],
  ];
};

export const day20 = (input: number[]) => {
  const mixedNumbers = runNumMixes(input, 1);
  const groveCoordinates = getGroveCoordinates(mixedNumbers);
  return sumArr(groveCoordinates, (i) => i);
};

export const day20part2 = (input: number[]) => {
  const decrypted = input.map((num) => num * 811589153);
  const mixedNumbers = runNumMixes(decrypted, 10);
  const groveCoordinates = getGroveCoordinates(mixedNumbers);
  return sumArr(groveCoordinates, (i) => i);
};
