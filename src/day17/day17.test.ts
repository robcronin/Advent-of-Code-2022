import { logAnswer } from '../utils/logging';
import { day17, day17part2 } from './day17';
import { data, testData } from './day17.data';

describe('day 17', () => {
  it('test cases', () => {
    expect(day17(testData, 2022)).toBe(3068);
  });

  it('answer', () => {
    const answer = day17(data, 2022);
    logAnswer(answer, 17, 1);
    expect(answer).toBe(3200);
  });
});

describe('day 17 part 2', () => {
  const actual = 1000000000000;
  const small = 100000;
  it.skip('test cases', () => {
    expect(day17part2(testData, actual)).toBe(1514285714288);
  });

  it.skip('extra case', () => {
    expect(day17part2(data, 2126)).toBe(3372);
  });

  it.only('small test cases for answer', () => {
    const part1V = day17(data, small);
    expect(day17part2(data, small)).toBe(part1V);
  });
  it.only('answer', () => {
    const answer = day17part2(data, actual);
    logAnswer(answer, 17, 2);
    expect(answer).toBe(1584927536247);
  });
});
