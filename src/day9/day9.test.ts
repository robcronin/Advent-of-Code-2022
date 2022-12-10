import { parseInput } from '../utils/input';
import { logAnswer } from '../utils/logging';
import { day9, day9part2 } from './day9';
import { data } from './day9.data';

const testString = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
const testString2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
const testData = parseInput(testString) as string[];
const testData2 = parseInput(testString2) as string[];

describe('day 9', () => {
  it('test cases', () => {
    expect(day9(testData)).toBe(13);
  });

  it('answer', () => {
    const answer = day9(data);
    logAnswer(answer, 9, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(5878);
  });
});

describe('day 9 part 2', () => {
  it('test cases', () => {
    expect(day9part2(testData)).toBe(1);
    expect(day9part2(testData2)).toBe(36);
  });

  it('answer', () => {
    const answer = day9part2(data);
    logAnswer(answer, 9, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(2405);
  });
});
