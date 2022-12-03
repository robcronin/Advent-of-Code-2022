import { parseInput } from '../utils/input';
import { logAnswer } from '../utils/logging';
import { day3, day3part2 } from './day3';
import { data } from './day3.data';

const testString = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
const testData = parseInput(testString) as string[];

describe('day 3', () => {
  it('test cases', () => {
    expect(day3(testData)).toBe(157);
  });

  it('answer', () => {
    const answer = day3(data);
    logAnswer(answer, 3, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(7597);
  });
});

describe('day 3 part 2', () => {
  it('test cases', () => {
    expect(day3part2(testData)).toBe(70);
  });

  it('answer', () => {
    const answer = day3part2(data);
    logAnswer(answer, 3, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(2607);
  });
});
