import { sumArr } from '../utils/array';

type RPS = 'R' | 'P' | 'S';
type Round = { me: RPS; them: RPS };

const getRpsScore = ({ me, them }: Round) => {
  const choiceScore = me === 'R' ? 1 : me === 'P' ? 2 : 3;
  if (me === them) return choiceScore + 3;
  if (
    (me === 'R' && them === 'S') ||
    (me === 'P' && them === 'R') ||
    (me === 'S' && them === 'P')
  ) {
    return choiceScore + 6;
  }
  return choiceScore;
};

const parseScoresOrder = (round: string): Round => {
  const [themCode, meCode] = round.split(' ');
  const me = meCode === 'X' ? 'R' : meCode === 'Y' ? 'P' : 'S';
  const them = themCode === 'A' ? 'R' : themCode === 'B' ? 'P' : 'S';

  return { me, them };
};

const parseScoresResult = (round: string): Round => {
  const [themCode, meCode] = round.split(' ');
  const them = themCode === 'A' ? 'R' : themCode === 'B' ? 'P' : 'S';
  let me: RPS;
  if (meCode === 'X') {
    me = them === 'R' ? 'S' : them === 'P' ? 'R' : 'P';
  }
  if (meCode === 'Y') {
    me = them;
  }
  if (meCode === 'Z') {
    me = them === 'R' ? 'P' : them === 'P' ? 'S' : 'R';
  }

  return { me, them };
};

export const day2 = (input: string[]) => {
  return sumArr(input, (round) => getRpsScore(parseScoresOrder(round)));
};
export const day2part2 = (input: string[]) => {
  return sumArr(input, (round) => getRpsScore(parseScoresResult(round)));
};
