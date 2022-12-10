import { logAnswer } from '../utils/logging';
import { day10, day10part2 } from './day10';
import { data, testData } from './day10.data';

describe('day 10', () => {
  it('test cases', () => {
    expect(day10(testData)).toBe(13140);
  });

  it('answer', () => {
    const answer = day10(data);
    logAnswer(answer, 10, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(14860);
  });
});

describe('day 10 part 2', () => {
  it('test cases', () => {
    expect(day10part2(testData))
      .toBe(`# # . . # # . . # # . . # # . . # # . . # # . . # # . . # # . . # # . . # # . .
# # # . . . # # # . . . # # # . . . # # # . . . # # # . . . # # # . . . # # # .
# # # # . . . . # # # # . . . . # # # # . . . . # # # # . . . . # # # # . . . .
# # # # # . . . . . # # # # # . . . . . # # # # # . . . . . # # # # # . . . . .
# # # # # # . . . . . . # # # # # # . . . . . . # # # # # # . . . . . . # # # #
# # # # # # # . . . . . . . # # # # # # # . . . . . . . # # # # # # # . . . . .
`);
  });

  it('answer', () => {
    const answer = day10part2(data);
    logAnswer(answer, 10, 2, true);
    expect(typeof answer).toBe('string');
    expect(answer)
      .toBe(`# # # . . . # # . . # # # # . # # # # . # . . # . # . . # . # # # . . # . . # .
# . . # . # . . # . . . . # . # . . . . # . . # . # . . # . # . . # . # . # . .
# . . # . # . . . . . . # . . # # # . . # # # # . # . . # . # . . # . # # . . .
# # # . . # . # # . . # . . . # . . . . # . . # . # . . # . # # # . . # . # . .
# . # . . # . . # . # . . . . # . . . . # . . # . # . . # . # . # . . # . # . .
# . . # . . # # # . # # # # . # # # # . # . . # . . # # . . # . . # . # . . # .
`);
  });
});
