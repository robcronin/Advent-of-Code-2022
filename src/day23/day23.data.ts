import { parseInput } from '../utils/input';

const smallTestString = `.....
..##.
..#..
.....
..##.
.....`;
const testString = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;
const input = `.#.....####..##.#.#.####.####.##....#...###...##...#.#..###.##.....#.#
.##..##.#.#...####....#.###....##..######...#..#...#..####...#...#.###
#...#.###...#...###.##.....##.#.#....#..###..#.##..........#....###.##
##..#...###..####.#.#.###..###...##.#....##....###.#.##.##.#.###.###.#
##.#..#..###.#.#.####.#..#.#.####..###.#.#.#.##.#...#.#..#..#####..##.
...####..#.#.####.#.#.##.###.#.#.#.##...#..#.####..#.#.#.##.......###.
..###.#.###...##.######......#.##........#.##......#....#...##.#.##..#
#....###..##.#####..##.#######....##.#..##.##..#..##..##.###.......#.#
#.#....###.#..#...####...##.##.#....#.#.#.#...##..##........#.#.###.##
..#....##....####...##.#.##..###.##.#..##...##.##.##..##..#.#.###...##
##.##.#..###.#.##..#....###...####....#.#.#.####.##.##.#....##...#.###
##.####...#....#....#.#.#.#...#...#...####.###..#.#..##.##..##.#.#....
##...#####...#.#....##....##..#.........#.#..#######.#.##.#.....#.....
##....#..#....##.##..########.#...#....#..###...#....#.#.#..#.##.....#
..##..#....##..#.#..###...#..###.#.##..##....#..#.##...####.##.##...#.
#...##..##.###..##....#.##..##.#.......####.#.#.#.###..#.#...#..###.##
.##..##.#.##.#.#.#####.#.#.#...#..##..##.##.##..#.##...#####.##..##.##
.##..###.#..###.#...##.###......##..#.###..#########....##.##.#..##.#.
.##.#.##.#.#..#.....##.###.#..##......#.##...#....###.##..##.#....#..#
#..#..##...#.#....###..#..####.#..##.######.#..#.#....##.##.#.#.###..#
#......#.##..#..##.#.#..##..#...###.#.####..##..##.#..#.##.#..##..#..#
#..#.###....#..#.......#####.##.#..####.#.##...##..##.####.####.....##
#.#..#...###.##...####.###..#.######.##.##..#.###.#..#.#.#######......
.####.#..........####.#.#.#....#...#...#..#..#...#.###.#..##..###..#..
.###.#...####.#.#.#.#..###.#..####..##.####.###..#...#...##..#.#.###..
##....#.#....##..####..##.#.#.##...#.#.#...#.#.#.#....##.....###..##..
......#.#..###..##.#.#..#.##.####...####..####......#.##.#.#..##......
#...########.##.##..##.#..###.##.#.#..#...##.#.#..###.##.#..#..#.##.##
##..#.##.###.##...##.##....#.#.#..#...##.####..#.#####.####.###.#..#.#
##.#.#....###.#......#..##..####...###.......##.....#...#...###..####.
###..#####.#.#....##......##..#...#......#.##.####.#.####..###.#.#.###
#.#..#.###.#....#.##....###.###.#.##..##.#..####..###...#...#..####...
#....##.#.#...#..#...#########.###.#.....#..#..#..#.###...#.##...###.#
##...#....#.###.#####...##.##..#..#.##.##..###.#..#..######.#.#.##.##.
...#..##.#..####....##..#..###.#.######.###.#########..#..#.##...#..#.
###.##..#.#..###.#.......##.##.##.#####....#####.##.##.##..####..####.
.#####..#.#.#...##..#.#...#######.......###..#.####.#..##.######.#.#..
#.#..#######....##.#.#..#.#..###.#.#...##.#...#..#....#.####..#..#....
##..#.#...#..#######......#..#.#...#########.#.#..#...#.#####...###.#.
.######.##..#.#..##.........###..####.....##...#..#..#...##.##.######.
#####.#####.#..#.###..###..#...#.##.#.##.###.#.#.###.#####...#.##..#..
#...#.#...##......####.#..#.##..#..####....#.#.#...#.#.....##....#...#
####.###...##...#..#..###....#.##..#.#.##...###...#.#.#.....#.##..#.##
.#.###.#.##.#.##.#..#....#..#.####.#.#.......#..#..#..#.#.#..#..#..#.#
..#......#.#.###.#######.#...###########.##.##.##..##.##.....#.#..##..
##..#.#.#..###...#...#######..##.#.#.##.##..#.#..##.....###..#.##.###.
#...###....#.#....#####.####..#..#.#.#...###....#.#.#.##...####..#...#
##.####.#...####.##.##.#...#..#..##...#.##..#.#.#...#.#...#..#####.##.
###.#.#..#..###..##.#.#....#..#...##.#..##.#.##...##.#....##.#.#..##..
..#....##..####..#..######.##..####.#...##.#.##.###..#..##..##.##....#
##.###.##..#.....##.#.##....##.###.#.##..##.#...#...#.#..#..#.#.##....
.#..##.....###....#....###..###..#..#.#..#..####.#..###.#.##...##....#
#.#..#..#..#..####.####.....######....#...##.#..###.#...#.#.#.#.###...
##..#..##.#.#.##.......#.####.#.#.##.#.#.#..#.####.#.#.#####......#.#.
##.#.#...##....#..##..#......######.#..#.#.###.......##.#.##.#...#####
##..##########..#..#.....##...####.##.#.##..#.......######.#.##...#.#.
#.##.#.########.##..##.##..#.#.#...#.#..##..#...#..##.#.#####.#.#.###.
.###.#....###..######.##.########.########...##.#.#####.###.##..#.#...
....#.#.##.##..#####..#####.#.#.#...####.#.#..#....#.#.##...#..#.#.###
.#####......#.##.#######.#.#.#.##.#.#####..##..##.....###.##.###..#..#
#...#..#.#####.#.#...#..#..####.#..####..###.#...#.#.....####.##.#####
#..##......##...##.#..##.....#.##..#..##.##.#.#.#.......##.##..#.####.
#######..###.##.##.###.##..#.##..#...#.###....#.###...#...##...#..#..#
..######...##.#.#..#####.#.#######.###.....##.#.###.......##.#####..##
.#..#####.......#........#...#..###.######...####.#..##...###.##.....#
..##......#..#.####..##...#..###..##.....#..#...#..#.##.##....#.###...
#..####.##.#..###.##.##.#...##....#.##.#.###.##....####...#.....##.#..
..####...###.##.#..#....###...#.....######.####...##.##.#...#...####..
..#...#.#..###.#......##...##...#.....###.####.....##.#.#..###.#.#.###
..######..##...#..###.#....#..####.##..#...##.##..###.######.#..#.##.#`;

export const smallTestData = parseInput(smallTestString) as string[];
export const testData = parseInput(testString) as string[];
export const data = parseInput(input) as string[];
