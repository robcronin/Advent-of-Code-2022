import { logAnswer } from '../utils/logging';
import { day6, day6part2 } from './day6';
import { data } from './day6.data';

const testData = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb';

describe('day 6', () => {
  it('test cases', () => {
    expect(day6(testData)).toBe(7);
    expect(day6('bvwbjplbgvbhsrlpgdmjqwftvncz')).toBe(5);
    expect(day6('nppdvjthqldpwncqszvftbrmjlhg')).toBe(6);
    expect(day6('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg')).toBe(10);
    expect(day6('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw')).toBe(11);
  });

  it('answer', () => {
    const answer = day6(data);
    logAnswer(answer, 6, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(1093);
  });
});

describe('day 6 part 2', () => {
  it('test cases', () => {
    expect(day6part2(testData)).toBe(19);
  });

  it('answer', () => {
    const answer = day6part2(data);
    logAnswer(answer, 6, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(3534);
  });
});
