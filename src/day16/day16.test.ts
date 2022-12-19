import { logAnswer } from '../utils/logging';
import { day16, day16part2 } from './day16';
import { data, testData } from './day16.data';

describe('day 16', () => {
  it('extra test cases', () => {
    expect(day16(testData, 5)).toBe(63);
  });
  it('extra test cases', () => {
    expect(day16(testData, 15)).toBe(520);
  });
  it('extra test cases', () => {
    expect(day16(testData, 20)).toBe(852);
  });
  it.skip('test cases', () => {
    expect(day16(testData, 30)).toBe(1651);
  });
  it.skip('answer', () => {
    const answer = day16(data, 30);
    logAnswer(answer, 16, 1);
    expect(answer).toBe(1828);
  });
});

describe('day 16 part 2', () => {
  it.only('extra test cases', () => {
    expect(day16part2(testData, 3)).toBe(33);
  });
  it.skip('extra test cases', () => {
    expect(day16part2(testData, 4)).toBe(33);
  });
  it.skip('extra test cases', () => {
    expect(day16part2(testData, 5)).toBe(105);
  });
  it.skip('test cases', () => {
    expect(day16part2(testData, 26)).toBe(1707);
  });

  it.skip('answer', () => {
    const answer = day16part2(data, 30);
    logAnswer(answer, 16, 2);
    expect(answer).toBe(16);
  });
});
