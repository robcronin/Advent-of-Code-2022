import { parseInput } from '../utils/input';
import { logAnswer } from '../utils/logging';
import { day7, day7part2 } from './day7';
import { data } from './day7.data';

const testString = `$ cd /
$ ls
dir app
14848514 b.txt
8504156 c.dat
dir dpp
$ cd app
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd dpp
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;
const testData = parseInput(testString) as string[];

describe('day 7', () => {
  it('test cases', () => {
    expect(day7(testData)).toBe(95437);
  });

  it('answer', () => {
    const answer = day7(data);
    logAnswer(answer, 7, 1);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(1581595);
  });
});

describe('day 7 part 2', () => {
  it('test cases', () => {
    expect(day7part2(testData)).toBe(24933642);
  });

  it('answer', () => {
    const answer = day7part2(data);
    logAnswer(answer, 7, 2);
    expect(typeof answer).toBe('number');
    expect(answer).toBe(1544176);
  });
});
