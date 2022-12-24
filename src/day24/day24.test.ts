import { logAnswer } from '../utils/logging';
import { day24, day24part2 } from './day24';
import { data, testData } from './day24.data';

describe('day 24', () => {
  it('test cases', () => {
    expect(day24(testData)).toBe(18);
  });

  it('answer', () => {
    const answer = day24(data);
    logAnswer(answer, 24, 1);
    expect(answer).toBe(288);
  });
});

describe('day 24 part 2', () => {
  it('test cases', () => {
    expect(day24part2(testData)).toBe(54);
  });

  it('answer', () => {
    const answer = day24part2(data);
    logAnswer(answer, 24, 2);
    expect(answer).toBe(861);
  });
});
