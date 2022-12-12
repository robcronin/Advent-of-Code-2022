import { logAnswer } from '../utils/logging';
import { day12, day12part2 } from './day12';
import { data, testData } from './day12.data';

describe('day 12', () => {
  it('test cases', () => {
    expect(day12(testData)).toBe(31);
  });

  it('answer', () => {
    const answer = day12(data);
    logAnswer(answer, 12, 1);
    expect(answer).toBe(490);
  });
});

describe('day 12 part 2', () => {
  it('test cases', () => {
    expect(day12part2(testData)).toBe(29);
  });

  it('answer', () => {
    const answer = day12part2(data);
    logAnswer(answer, 12, 2);
    expect(answer).toBe(488);
  });
});
