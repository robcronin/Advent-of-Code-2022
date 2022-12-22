import { logAnswer } from '../utils/logging';
import { day21, day21part2 } from './day21';
import { data, testData } from './day21.data';

describe.only('day 21', () => {
  it('test cases', () => {
    expect(day21(testData)).toBe(152);
  });

  it('answer', () => {
    const answer = day21(data);
    logAnswer(answer, 21, 1);
    expect(answer).toBe(81075092088442);
  });
});

describe.only('day 21 part 2', () => {
  it('test cases', () => {
    expect(day21part2(testData)).toBe(301);
  });

  it('answer', () => {
    const answer = day21part2(data);
    logAnswer(answer, 21, 2);
    expect(answer).toBe(3349136384441);
  });
});
