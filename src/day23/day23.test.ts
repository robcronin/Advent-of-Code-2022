import { logAnswer } from '../utils/logging';
import { day23, day23part2 } from './day23';
import { data, smallTestData, testData } from './day23.data';

describe('day 23', () => {
  it('test cases', () => {
    expect(day23(testData)).toBe(110);
  });

  it('answer', () => {
    const answer = day23(data);
    logAnswer(answer, 23, 1);
    expect(answer).toBe(3877);
  });
});

describe('day 23 part 2', () => {
  it('small test cases', () => {
    expect(day23part2(smallTestData)).toBe(4);
  });
  it('test cases', () => {
    expect(day23part2(testData)).toBe(20);
  });

  it.skip('answer', () => {
    const answer = day23part2(data);
    logAnswer(answer, 23, 2);
    expect(answer).toBe(982);
  });
});
