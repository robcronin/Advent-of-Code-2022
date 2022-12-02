import { parseInput } from '../utils/input';
import { logAnswer } from '../utils/logging';
import { day2, day2part2 } from './day2';
import { data } from './day2.data';

const testString = `A Y
B X
C Z`;
const testData = parseInput(testString) as string[];

describe('day 2', () => {
  it('test cases', () => {
    expect(day2(testData)).toBe(15);
  });

  it('answer', () => {
    const answer = day2(data);
    logAnswer(answer, 2, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(13446);
  });
});

describe('day 2 part 2', () => {
  it('test cases', () => {
    expect(day2part2(testData)).toBe(12);
  });

  it('answer', () => {
    const answer = day2part2(data);
    logAnswer(answer, 2, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(13509);
  });
});
