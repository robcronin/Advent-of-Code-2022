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

describe.only('day 16 part 2', () => {
  it('extra test cases - 3', () => {
    expect(day16part2(testData, 3)).toBe(33);
  });
  it('extra test cases - 4', () => {
    expect(day16part2(testData, 4)).toBe(66);
  });
  it('extra test cases - 5', () => {
    expect(day16part2(testData, 5)).toBe(105);
  });
  it('extra test cases - 10', () => {
    expect(day16part2(testData, 10)).toBe(414);
  });
  it('extra test cases - 15', () => {
    expect(day16part2(testData, 15)).toBe(816);
  });
  it.only('extra test cases - 18', () => {
    expect(day16part2(testData, 18)).toBe(1059);
  });
  it('test cases', () => {
    expect(day16part2(testData, 26)).toBe(1707);
  });

  it.skip('answer test case - 10', () => {
    const answer = day16part2(data, 10);
    expect(answer).toBe(255);
  });
  it.skip('answer test case - 15', () => {
    const answer = day16part2(data, 15);
    expect(answer).toBe(744);
  });

  it('answer', () => {
    const answer = day16part2(data, 26);
    logAnswer(answer, 16, 2);
    expect(answer).toBe(16);
  });
});
