import { logAnswer } from '../utils/logging';
import { day19, day19part2 } from './day19';
import { data, testData } from './day19.data';

describe.only('day 19', () => {
  it.only('one blueprint', () => {
    expect(day19([testData[0]], 24)).toBe(9); // 34s -> 16s (prio obsidian)
  });
  it.only('second blueprint', () => {
    expect(day19([testData[1]], 24)).toBe(24); // 73s -> 45s (prio obsidian)
  });
  it.skip('reduced test cases', () => {
    expect(day19([testData[0]], 19)).toBe(1); //
  });
  it('test cases', () => {
    expect(day19(testData, 24)).toBe(33); //
  });

  it('zeroer', () => {
    const answer = day19([data[2]], 24); //
    logAnswer(answer, 19, 1);
    expect(answer).toBe(19);
    // 1335 - too low
  });

  it('answer', () => {
    const answer = day19(data, 24); //
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
