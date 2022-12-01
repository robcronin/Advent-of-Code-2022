import { logAnswer } from '../utils/logging';
import { day1, day1part2, parseCalories } from './day1';
import { data } from './day1.data';

const testString = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
const testData = parseCalories(testString);

describe('day 1', () => {
  it('test cases', () => {
    expect(day1(testData)).toBe(24000);
  });

  it('answer', () => {
    const answer = day1(data);
    logAnswer(answer, 1, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(69177);
  });
});

describe('day 1 part 2', () => {
  it('test cases', () => {
    expect(day1part2(testData)).toBe(45000);
  });

  it('answer', () => {
    const answer = day1part2(data);
    logAnswer(answer, 1, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(207456);
  });
});
