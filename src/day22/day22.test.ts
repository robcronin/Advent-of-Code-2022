import { logAnswer } from '../utils/logging';
import { day22, day22part2 } from './day22';
import { data, testData } from './day22.data';

describe('day 22', () => {
  it('test cases', () => {
    expect(day22(testData)).toBe(6032);
  });

  it('answer', () => {
    const answer = day22(data);
    logAnswer(answer, 22, 1);
    expect(answer).toBe(26558);
  });
});

describe('day 22 part 2', () => {
  it.skip('test cases', () => {
    expect(day22part2(testData)).toBe(5031);
  });

  it('answer', () => {
    const answer = day22part2(data);
    logAnswer(answer, 22, 2);
    expect(answer).toBe(110400);
  });
});
