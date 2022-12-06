import { logAnswer } from '../utils/logging';
import { day5, day5part2 } from './day5';
import { input } from './day5.data';

const testInput = `    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

describe('day 5', () => {
  it('test cases', () => {
    expect(day5(testInput)).toBe('CMZ');
  });

  it('answer', () => {
    const answer = day5(input);
    logAnswer(answer, 5, 1);
    expect(answer).toBe('SBPQRSCDF');
  });
});

describe('day 5 part 2', () => {
  it('test cases', () => {
    expect(day5part2(testInput)).toBe('MCD');
  });

  it('answer', () => {
    const answer = day5part2(input);
    logAnswer(answer, 5, 2);
    expect(answer).toBe('RGLVRCQSB');
  });
});
