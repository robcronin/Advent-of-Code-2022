import { sumArr } from '../utils/array';

const splitRucksackComps = (rucksack: string) => {
  const rucksackLength = rucksack.length;
  const comp1 = rucksack.slice(0, rucksackLength / 2);
  const comp2 = rucksack.slice(rucksackLength / 2, rucksackLength);
  return [comp1, comp2];
};

const findCommonItem = (elves: string[]) => {
  const [first, ...rest] = elves;
  const commonItem = [...first].find((item) =>
    rest.every((elf) => elf.includes(item)),
  );
  if (!commonItem) throw new Error(`No common item found in ${elves}`);
  return commonItem;
};

const getItemPriority = (item: string) => {
  const index = item.charCodeAt(0);
  if (index >= 97) return index - 96;
  return index - 64 + 26;
};

const getElfGroups = (input: string[], size: number = 3) =>
  input.reduce((groups: string[][], _elf, index) => {
    if (index % size === 0) {
      return [...groups, input.slice(index, index + 3)];
    }
    return groups;
  }, []);

export const day3 = (input: string[]) =>
  sumArr(input, (rucksack) =>
    getItemPriority(findCommonItem(splitRucksackComps(rucksack))),
  );

export const day3part2 = (input: string[]) => {
  const elfGroups = getElfGroups(input);
  return sumArr(elfGroups, (group) => getItemPriority(findCommonItem(group)));
};
