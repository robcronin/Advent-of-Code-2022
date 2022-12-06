import { countArr } from '../utils/array';

type SectionPair = {
  start1: number;
  end1: number;
  start2: number;
  end2: number;
};

const parseSectionPairs = (input: string[]): SectionPair[] =>
  input.map((sectionString) => {
    const groups = sectionString.match(
      new RegExp('^([0-9]+)-([0-9]+),([0-9]+)-([0-9]+)$'),
    );
    if (!groups) throw new Error(`Invalid sectionString: ${sectionString}`);
    const [_, start1, end1, start2, end2] = groups;
    return { start1: +start1, end1: +end1, start2: +start2, end2: +end2 };
  });

const getIsSectionFullyOverlap = (sectionPair: SectionPair) => {
  const { start1, end1, start2, end2 } = sectionPair;
  return (
    (start2 >= start1 && end2 <= end1) || (start1 >= start2 && end1 <= end2)
  );
};

const getIsSectionOverlap = (sectionPair: SectionPair) => {
  const { start1, end1, start2, end2 } = sectionPair;
  return (
    (start2 >= start1 && start2 <= end1) || (start1 >= start2 && start1 <= end2)
  );
};

export const day4 = (input: string[]) => {
  const sectionPairs = parseSectionPairs(input);
  return countArr(sectionPairs, getIsSectionFullyOverlap);
};

export const day4part2 = (input: string[]) => {
  const sectionPairs = parseSectionPairs(input);
  return countArr(sectionPairs, getIsSectionOverlap);
};
