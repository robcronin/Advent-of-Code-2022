import { logAnswer } from '../utils/logging';
import { day14, day14part2 } from './day14';
import { data, testData } from './day14.data';

describe('day 14', () => {
  it('test cases', () => {
    expect(day14(testData)).toBe(24);
  });

  it('answer', () => {
    const answer = day14(data);
    logAnswer(answer, 14, 1);
    expect(answer).toBe(873);
  });
});

describe('day 14 part 2', () => {
  it('test cases', () => {
    expect(day14part2(testData)).toBe(93);
  });

  it('answer', () => {
    const answer = day14part2(data);
    logAnswer(answer, 14, 2);
    expect(answer).toBe(24813);
  });
});
