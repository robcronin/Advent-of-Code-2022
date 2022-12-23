import { logAnswer } from '../utils/logging';
import { day19, day19part2 } from './day19';
import { data, testData } from './day19.data';

describe('day 19', () => {
  it.skip('one blueprint', () => {
    expect(day19([testData[0]], 24)).toBe(9); // 34s -> 16s (prio obsidian) -> 5s(check max) -> 3.1s(upper bound) -> 1.2s(smart upper) -> 0.6s(lte upper) -> 0.28s (stricter upper)
  });
  it.skip('second blueprint', () => {
    expect(day19([testData[1]], 24)).toBe(24); // 73s -> 45s (prio obsidian) -> 13s(check max) -> 8.2s(upper bound) -> 2.6 (smart upper) -> 0.9s(lte upper) -> 0.74s(stricter upper)
  });
  it('test cases', () => {
    expect(day19(testData, 24)).toBe(33); // 18s -> 12s(upper bound) -> 3.8s(smart upper bound) -> 1.6s (stricter upper)
  });

  it('zero answer', () => {
    const answer = day19([data[2]], 24); // 84s(upper bound) -> 3.587s(smart upper bound) -> 0.2s (lte upper check) -> 0.018s (stricter upper)
    expect(answer).toBe(0);
  });

  it.skip('answer', () => {
    const answer = day19(data, 24); // 498s (smart upper bound) -> 11.6s(stricter upper)
    logAnswer(answer, 19, 1);
    expect(answer).toBe(1356);
  });
});

describe('day 19 part 2', () => {
  it.skip('test cases', () => {
    expect(day19part2(testData, 32)).toBe(62 * 56);
  });

  it.skip('answer', () => {
    const answer = day19part2(data, 32);
    logAnswer(answer, 19, 2);
    expect(answer).toBe(2943);
  });
});
