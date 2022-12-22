import { logAnswer } from '../utils/logging';
import { day19, day19part2 } from './day19';
import { data, testData } from './day19.data';

describe.only('day 19', () => {
  it.skip('reduced test cases', () => {
    expect(day19([testData[0]], 19)).toBe(1); // 0.4s(check max)
  });
  it.skip('one blueprint', () => {
    expect(day19([testData[0]], 24)).toBe(9); // 34s -> 16s (prio obsidian) -> 5s(check max)
  });
  it.skip('second blueprint', () => {
    expect(day19([testData[1]], 24)).toBe(24); // 73s -> 45s (prio obsidian) -> 13s(check max)
  });
  it.only('test cases', () => {
    expect(day19(testData, 24)).toBe(33); // 18s
  });

  it.skip('zeroer', () => {
    const answer = day19([data[2]], 24); //
    expect(answer).toBe(0);
  });

  it.skip('answer', () => {
    const answer = day19(data, 24); //
    logAnswer(answer, 19, 1);
    expect(answer).toBe(19);
    // 1335 - too low
    // 1273 - too low
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
