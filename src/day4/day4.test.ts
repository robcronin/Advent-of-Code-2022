import { parseInput } from '../utils/input';
import { logAnswer } from '../utils/logging';
import { day4, day4part2 } from './day4';
import { data } from './day4.data';

const testString = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
const testData = parseInput(testString) as string[];

describe('day 4', () => {
  it('test cases', () => {
    expect(day4(testData)).toBe(2);
  });

  it('answer', () => {
    const answer = day4(data);
    logAnswer(answer, 4, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(651);
  });
});

describe('day 4 part 2', () => {
  it('test cases', () => {
    expect(day4part2(testData)).toBe(4);
  });

  it('answer', () => {
    const answer = day4part2(data);
    logAnswer(answer, 4, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(956);
  });
});
