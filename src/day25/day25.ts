import { sumArr } from '../utils/array';
import { range } from '../utils/looping';

const covertSnafuToDecimal = (snafu: string) =>
  sumArr([...snafu].reverse(), (digit, index) => {
    let num = digit === '=' ? -2 : digit === '-' ? -1 : +digit;
    return num * 5 ** index;
  });

export const convertDecimalToSnafu = (decimal: number) => {
  let num = decimal;
  let startPower = 0;
  while (decimal >= 5 ** startPower) startPower++;
  startPower--;

  const fivesNum = range(startPower, -1).map((pow) => {
    const value = Math.floor(num / 5 ** pow);
    num -= value * 5 ** pow;
    return value;
  });

  const conversion = ['0', '1', '2', '=', '-', '0'];

  let carry = 0;
  const snafu = fivesNum.reverse().map((fivePre) => {
    const five = fivePre + carry;
    if (five <= 2) carry = 0;
    else carry = 1;
    return conversion[five];
  });
  if (carry > 0) snafu.push('1');

  return snafu.reverse().join('');
};

export const day25 = (input: string[]) => {
  const sumDecimal = sumArr(input, covertSnafuToDecimal);
  return convertDecimalToSnafu(sumDecimal);
};
