import { parseLines } from '../utils/input';
import { logAnswer } from '../utils/logging';
import { day8, day8part2 } from './day8';
import { data } from './day8.data';

const testString = `30373
25512
65332
33549
35390`;
const testData = parseLines(testString) as string[];

describe('day 8', () => {
  it('test cases', () => {
    expect(day8(testData)).toBe(21);
  });

  it('answer', () => {
    const answer = day8(data);
    logAnswer(answer, 8, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(1711);
  });
});

describe('day 8 part 2', () => {
  it('test cases', () => {
    expect(day8part2(testData)).toBe(8);
  });

  it('answer', () => {
    const answer = day8part2(data);
    logAnswer(answer, 8, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(301392);
  });
});
