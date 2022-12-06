const findMarker = (input: string, markerLength: number) => {
  const markerStart = [...input].findIndex((_, i) => {
    const chars = input.slice(i, i + markerLength);
    return [...chars].every(
      (char, index) => !chars.slice(index + 1).includes(char),
    );
  });
  return markerStart + markerLength;
};

export const day6 = (input: string) => findMarker(input, 4);
export const day6part2 = (input: string) => findMarker(input, 14);
