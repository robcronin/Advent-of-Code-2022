import { logAnswer } from '../utils/logging';
import { day16, day16part2 } from './day16';
import { data, testData } from './day16.data';

describe.only('day 16', () => {
  it('extra test cases - 5', () => {
    expect(day16(testData, 5)).toBe(63);
  });
  it('extra test cases - 15', () => {
    expect(day16(testData, 15)).toBe(520);
  });
  it('extra test cases - 20', () => {
    expect(day16(testData, 20)).toBe(852); // 0.1s(start) -> 0.015s(upper bound)
  });
  it('test cases - 30', () => {
    expect(day16(testData, 30)).toBe(1651); // 2.4s(start) -> 0.02s(upper bound) -> 0.013s(no on check in memo)
  });
  it('answer', () => {
    const answer = day16(data, 30); // 20s(start) -> 5.2s(upper bound) -> 0.6s(no on check in memo)
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
    expect(day16part2(testData, 5)).toBe(105); // 0.004s(1.start)
  });
  it('extra test cases - 10', () => {
    expect(day16part2(testData, 10)).toBe(414); // 0.26s(1.start)
  });
  it('extra test cases - 15', () => {
    expect(day16part2(testData, 15)).toBe(816); // 8s(1.start)
  });
  it('extra test cases - 18', () => {
    expect(day16part2(testData, 18)).toBe(1059); // 32.7s(1.start) -> 0.04s (2.upper bound)
  });
  it.only('test cases', () => {
    expect(day16part2(testData, 26)).toBe(1707);
  });

  it('answer test case - 10', () => {
    const answer = day16part2(data, 10);
    expect(answer).toBe(255);
  });
  it.only('answer test case - 15', () => {
    const answer = day16part2(data, 15); // 7.5s(2.upper bound)  -> 4.2s(3.remove on string) -> 0.75s(4.stricter bound) -> 0.37s(6.mirror elephant in memo) -> 0.22s(8.better upper bound)
    expect(answer).toBe(744);
  });
  it('answer test case - 20', () => {
    const answer = day16part2(data, 20); // 37s(3.remove on string)-> 9.3s(4.stricter bound) -> 6.6s(5.memo upper) -> 4.2s(6.mirror elephant in memo) -> 6.8s(7.make correct upper bound) -> 2.7s(8.better upper bound)
    expect(answer).toBe(1359);
  });
  it('answer test case - 23', () => {
    const answer = day16part2(data, 23); // 37s(4.stricter bound) -> 22.5(5.memo upper) -> 14.9(6.mirror elephant in memo)
    expect(answer).toBe(1791);
  });
  it('answer test case - 24', () => {
    const answer = day16part2(data, 24); // 31.2(5.memo upper) -> 20s(6.mirror elephant in memo)
    expect(answer).toBe(1954);
  });
  it('answer test case - 25', () => {
    const answer = day16part2(data, 25); // ??(5.memo upper) -> 27s(6.mirror elephant in memo)
    expect(answer).toBe(2119);
  });

  it('answer', () => {
    const answer = day16part2(data, 26); // 34s(6.mirror elephant in memo) -> 46s(7.make correct upper bound) -> 26.7s(8.better upper bound)
    logAnswer(answer, 16, 2);
    expect(answer).toBe(2292);
  });
});
