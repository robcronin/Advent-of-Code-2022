import { logAnswer } from '../utils/logging';
import { day15, day15part2 } from './day15';
import { data, testData } from './day15.data';

describe('day 15', () => {
  it('test cases', () => {
    expect(day15(testData, 10)).toBe(26);
  });
  it('extra test cases', () => {
    expect(day15(testData, 9)).toBe(25);
    expect(day15(testData, 11)).toBe(28);
  });

  it('answer', () => {
    const answer = day15(data, 2000000);
    logAnswer(answer, 15, 1);
    expect(answer).toBe(5832528);
  });
});

describe('day 15 part 2', () => {
  it('test cases', () => {
    expect(day15part2(testData, 20)).toBe(56000011);
  });

  it.skip('answer', () => {
    const answer = day15part2(data, 4000000);
    logAnswer(answer, 15, 2);
    expect(answer).toBe(13360899249595);
  });
});
