import { logAnswer } from '../utils/logging';
import { day19, day19part2 } from './day19';
import { data, testData } from './day19.data';

describe.only('day 19', () => {
  it.only('one blueprint', () => {
    expect(day19([testData[0]], 24)).toBe(9); // 33s -> 11.9s(no empty if all robots) -> 1s(maxore) -> 0.3s(max every) -> 0.08s (skip none)
  });
  it.skip('second blueprint', () => {
    expect(day19([testData[1]], 24)).toBe(24); // ??s -> 46.8s(no empty)-> 15s(maxore) -> 1.6s(max every) -> 0.2s (skip none)
  });
  it.skip('reduced test cases', () => {
    expect(day19([testData[0]], 19)).toBe(1); // 27s -> 9s -> 0.1s (skip none)
  });
  it('test cases', () => {
    expect(day19(testData, 24)).toBe(33); // 0.24s (skip none)
  });

  it('zeroer', () => {
    const answer = day19([data[2]], 24); // 11.7s (skip none)
    logAnswer(answer, 19, 1);
    expect(answer).toBe(19);
    // 1335 - too low
  });

  it('answer', () => {
    const answer = day19(data, 24); // 11.7s (skip none)
    logAnswer(answer, 19, 1);
    expect(answer).toBe(19);
    // 1335 - too low
  });
});

describe('day 19 part 2', () => {
  it('test cases', () => {
    expect(day19part2(testData)).toBe(19);
  });

  it('answer', () => {
    const answer = day19part2(data);
    logAnswer(answer, 19, 2);
    expect(answer).toBe(19);
  });
});
