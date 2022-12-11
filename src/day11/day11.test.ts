import { logAnswer } from '../utils/logging';
import { day11, day11part2 } from './day11';
import { data, testData } from './day11.data';

describe('day 11', () => {
  it('test cases', () => {
    expect(day11(testData)).toBe(10605);
  });

  it('answer', () => {
    const answer = day11(data);
    logAnswer(answer, 11, 1);
    expect(answer).toBe(62491);
  });
});

describe('day 11 part 2', () => {
  it('test cases', () => {
    expect(day11part2(testData)).toBe(2713310158);
  });

  it('answer', () => {
    const answer = day11part2(data);
    logAnswer(answer, 11, 2);
    expect(answer).toBe(17408399184);
  });
});
