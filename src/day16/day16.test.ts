import { logAnswer } from '../utils/logging';
import { day16, day16part2 } from './day16';
import { data, testData } from './day16.data';

describe.only('day 16', () => {
  it('extra test cases', () => {
    expect(day16(testData, 5)).toBe(60);
  });
  it('extra test cases', () => {
    expect(day16(testData, 15)).toBe(520);
  });
  it('extra test cases', () => {
    expect(day16(testData, 20)).toBe(852);
  });
  it('test cases', () => {
    expect(day16(testData, 30)).toBe(1651);
  });
  it('answer', () => {
    const answer = day16(data, 30);
    logAnswer(answer, 16, 1);
    expect(answer).toBe(1828);
  });
});

describe('day 16 part 2', () => {
  it('test cases', () => {
    expect(day16part2(testData)).toBe(16);
  });

  it('answer', () => {
    const answer = day16part2(data);
    logAnswer(answer, 16, 2);
    expect(answer).toBe(16);
  });
});
