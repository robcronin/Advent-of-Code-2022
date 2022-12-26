import { logAnswer } from '../utils/logging';
import { convertDecimalToSnafu, day25 } from './day25';
import { data, testData } from './day25.data';

describe.only('convertDecimalToSnafu', () => {
  it.each([
    [1, '1'],
    [2, '2'],
    [3, '1='],
    [4, '1-'],
    [5, '10'],
    [8, '2='],
    [2022, '1=11-2'],
    [314159265, '1121-1110-1=0'],
  ])('should convert %p to %p', (decimal, snafu) => {
    expect(convertDecimalToSnafu(decimal)).toBe(snafu);
  });
});

describe.only('day 25', () => {
  it('test cases', () => {
    expect(day25(testData)).toBe('2=-1=0');
  });

  it('answer', () => {
    const answer = day25(data);
    logAnswer(answer, 25, 1);
    expect(answer).toBe('2-212-2---=00-1--102');
  });
});
