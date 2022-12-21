import { logAnswer } from '../utils/logging';
import { day18, day18part2 } from './day18';
import { data, smallTestData, testData } from './day18.data';

describe('day 18', () => {
  it('small test cases', () => {
    expect(day18(smallTestData)).toBe(10);
  });
  it('test cases', () => {
    expect(day18(testData)).toBe(64);
  });

  it('answer', () => {
    const answer = day18(data);
    logAnswer(answer, 18, 1);
    expect(answer).toBe(4390);
  });
});

describe('day 18 part 2', () => {
  it('small test cases', () => {
    expect(day18part2(smallTestData)).toBe(10);
  });
  it('test cases', () => {
    expect(day18part2(testData)).toBe(58);
  });

  it('answer', () => {
    const answer = day18part2(data);
    logAnswer(answer, 18, 2);
    expect(answer).toBe(2534);
  });
});
