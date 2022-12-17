type Pair = (number | number[])[];
type Ordering = 'even' | true | false;

const getPairs = (input: string[]): Pair[] =>
  input.map((i) => {
    const [a, b] = i.split('\n');
    return [JSON.parse(a), JSON.parse(b)];
  });

const getPackets = (input: string[]): Pair[] =>
  input.reduce((acc: Pair[], i) => {
    const [a, b] = i.split('\n');
    return [...acc, JSON.parse(a), JSON.parse(b)];
  }, []);

const isPairOrdered = (pairA: Pair, pairB: Pair): Ordering => {
  let strictOrder = false;
  const isOrdered = pairA.every((a, index) => {
    const b = pairB[index];
    let ordering: Ordering;
    if (b === undefined) return false;
    if (typeof a === 'number' && typeof b === 'number') {
      ordering = a === b ? 'even' : a < b;
    } else if (typeof a === 'object' && typeof b === 'object') {
      ordering = isPairOrdered(a, b);
    } else if (typeof a === 'number' && typeof b === 'object') {
      ordering = isPairOrdered([a], b);
    } else if (typeof a === 'object' && typeof b === 'number') {
      ordering = isPairOrdered(a, [b]);
    } else {
      throw new Error(`type discrepency: ${a}, ${b}`);
    }
    if (ordering === true) strictOrder = true;
    return ordering;
  });
  if (strictOrder) return true;
  if (isOrdered) {
    if (pairA.length < pairB.length) return true;
    return 'even';
  }
  return false;
};

const findPacket = (packets: Pair[], needle: Pair) =>
  packets.findIndex(
    (packet) => JSON.stringify(packet) === JSON.stringify(needle),
  ) + 1;

export const day13 = (input: string[]) => {
  const pairs = getPairs(input);
  return pairs.reduce((sum, pair, index) => {
    if (isPairOrdered(pair[0], pair[1])) {
      return sum + index + 1;
    }
    return sum;
  }, 0);
};

export const day13part2 = (input: string[]) => {
  const additionalPackets = [[[2]], [[6]]];
  const packets = [...getPackets(input), ...additionalPackets];

  packets.sort((pairA, pairB) => (isPairOrdered(pairA, pairB) ? -1 : 1));

  const ind1 = findPacket(packets, additionalPackets[0]);
  const ind2 = findPacket(packets, additionalPackets[1]);

  return ind1 * ind2;
};
