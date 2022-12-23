import { sumArr } from '../utils/array';
import { range } from '../utils/looping';

type Blueprint = {
  id: number;
  oreRobotOreCost: number;
  clayRobotOreCost: number;
  obsidianRobotOreCost: number;
  obsidianRobotClayCost: number;
  geodeRobotOreCost: number;
  geodeRobotObsidianCost: number;
};
type Backpack = {
  numOre: number;
  numClay: number;
  numObsidian: number;
  numGeode: number;
  numOreRobots: number;
  numClayRobots: number;
  numObsidianRobots: number;
  numGeodeRobots: number;
};
enum Robot {
  ORE = 5,
  CLAY = 1,
  OBSIDIAN = 2,
  GEODE = 3,
  NONE = 4,
}

const parseBlueprints = (input: string[]): Blueprint[] =>
  input.map((line) => {
    const groups = line.match(
      new RegExp(
        'Blueprint ([0-9]+): Each ore robot costs ([0-9]+) ore. Each clay robot costs ([0-9]+) ore. Each obsidian robot costs ([0-9]+) ore and ([0-9]+) clay. Each geode robot costs ([0-9]+) ore and ([0-9]+) obsidian.',
      ),
    );
    if (!groups) throw new Error(`Blueprint invalid: ${line}`);
    return {
      id: +groups[1],
      oreRobotOreCost: +groups[2],
      clayRobotOreCost: +groups[3],
      obsidianRobotOreCost: +groups[4],
      obsidianRobotClayCost: +groups[5],
      geodeRobotOreCost: +groups[6],
      geodeRobotObsidianCost: +groups[7],
    };
  });

const getInitialBackpack = (): Backpack => ({
  numOre: 0,
  numClay: 0,
  numObsidian: 0,
  numGeode: 0,
  numOreRobots: 1, // ore
  numClayRobots: 0, // ore
  numObsidianRobots: 0, // ore & clay
  numGeodeRobots: 0, // ore & obsidian
});

const getBackpackKey = (backpack: Backpack, numMinutes: number) => {
  const {
    numOre,
    numClay,
    numObsidian,
    numGeode,
    numOreRobots,
    numClayRobots,
    numObsidianRobots,
    numGeodeRobots,
  } = backpack;
  return `${numMinutes}:${numOre},${numClay},${numObsidian},${numGeode},${numOreRobots},${numClayRobots},${numObsidianRobots},${numGeodeRobots}`;
};

const getAllAvailableOptions = (
  canMakeOreRobot: boolean,
  canMakeClayRobot: boolean,
  canMakeObsidianRobot: boolean,
) => {
  const options = [Robot.NONE];
  if (canMakeObsidianRobot) options.push(Robot.OBSIDIAN);
  if (canMakeClayRobot) options.push(Robot.CLAY);
  if (canMakeOreRobot) options.push(Robot.ORE);
  return options;
};

const getRobotOptions = (
  blueprint: Blueprint,
  backpack: Backpack,
  numMinutes: number,
  globalMax: number,
) => {
  const {
    oreRobotOreCost,
    clayRobotOreCost,
    obsidianRobotOreCost,
    obsidianRobotClayCost,
    geodeRobotOreCost,
    geodeRobotObsidianCost,
  } = blueprint;
  const {
    numOre,
    numClay,
    numObsidian,
    numOreRobots,
    numClayRobots,
    numObsidianRobots,
  } = backpack;

  // Upper limit check - make multiple robots every minute at no cost
  const maxGeode = range(numMinutes, 0).reduce(
    (newBackpack: Backpack) => {
      const canMakeGeode =
        geodeRobotOreCost <= newBackpack.numOre &&
        geodeRobotObsidianCost <= newBackpack.numObsidian;
      const canMakeObsidianRobot =
        obsidianRobotOreCost <= newBackpack.numOre &&
        obsidianRobotClayCost <= newBackpack.numClay;
      const canMakeClayRobot = clayRobotOreCost <= newBackpack.numOre;
      const canMakeOreRobot = oreRobotOreCost <= newBackpack.numOre;
      return {
        ...newBackpack,
        numOre: newBackpack.numOre + newBackpack.numOreRobots,
        numClay: newBackpack.numClay + newBackpack.numClayRobots,
        numObsidian: newBackpack.numObsidian + newBackpack.numObsidianRobots,
        numGeode: newBackpack.numGeode + newBackpack.numGeodeRobots,
        numOreRobots: canMakeOreRobot
          ? newBackpack.numOreRobots + 1
          : newBackpack.numOreRobots,
        numClayRobots: canMakeClayRobot
          ? newBackpack.numClayRobots + 1
          : newBackpack.numClayRobots,
        numObsidianRobots: canMakeObsidianRobot
          ? newBackpack.numObsidianRobots + 1
          : newBackpack.numObsidianRobots,
        numGeodeRobots: canMakeGeode
          ? newBackpack.numGeodeRobots + 1
          : newBackpack.numGeodeRobots,
      };
    },
    { ...backpack },
  ).numGeode;

  if (maxGeode <= globalMax) return [];

  /// Always make geode if possible
  const canMakeGeode =
    numMinutes >= 2 &&
    geodeRobotOreCost <= numOre &&
    geodeRobotObsidianCost <= numObsidian;
  if (canMakeGeode) return [Robot.GEODE];

  // Else get the options for possible robots that can be made
  // Don't need robot if already have more robots than max cost
  const maxOreRobotsNeeded = Math.max(
    clayRobotOreCost,
    obsidianRobotOreCost,
    geodeRobotOreCost,
  );
  const maxClayRobotsNeeded = obsidianRobotClayCost;
  const maxObsidianRobotsNeeded = geodeRobotObsidianCost;

  const canAndShouldMakeObsidianRobot =
    obsidianRobotOreCost <= numOre &&
    obsidianRobotClayCost <= numClay &&
    numObsidianRobots < maxObsidianRobotsNeeded;
  const canAndShouldMakeClayRobot =
    clayRobotOreCost <= numOre && numClayRobots < maxClayRobotsNeeded;
  const canAndShouldMakeOreRobot =
    oreRobotOreCost <= numOre && numOreRobots < maxOreRobotsNeeded;

  return getAllAvailableOptions(
    canAndShouldMakeOreRobot,
    canAndShouldMakeClayRobot,
    canAndShouldMakeObsidianRobot,
  );
};

const getMaxNumGeodes = (
  memo: Record<string, number>,
  blueprint: Blueprint,
  numMinutes: number,
  backpack: Backpack,
): number => {
  if (numMinutes === 0) return backpack.numGeode;
  const backpackKey = getBackpackKey(backpack, numMinutes);
  if (memo[backpackKey]) return memo[backpackKey];

  const robotOptions = getRobotOptions(
    blueprint,
    backpack,
    numMinutes,
    memo.globalMax,
  );
  const newBackpack = {
    ...backpack,
    numOre: backpack.numOre + backpack.numOreRobots,
    numClay: backpack.numClay + backpack.numClayRobots,
    numObsidian: backpack.numObsidian + backpack.numObsidianRobots,
    numGeode: backpack.numGeode + backpack.numGeodeRobots,
  };
  let max = newBackpack.numGeode;

  robotOptions.forEach((robotOption) => {
    let numGeodes = 0;
    switch (robotOption) {
      case Robot.ORE:
        numGeodes = getMaxNumGeodes(memo, blueprint, numMinutes - 1, {
          ...newBackpack,
          numOre: newBackpack.numOre - blueprint.oreRobotOreCost,
          numOreRobots: newBackpack.numOreRobots + 1,
        });
        break;
      case Robot.CLAY:
        numGeodes = getMaxNumGeodes(memo, blueprint, numMinutes - 1, {
          ...newBackpack,
          numOre: newBackpack.numOre - blueprint.clayRobotOreCost,
          numClayRobots: newBackpack.numClayRobots + 1,
        });
        break;
      case Robot.OBSIDIAN:
        numGeodes = getMaxNumGeodes(memo, blueprint, numMinutes - 1, {
          ...newBackpack,
          numOre: newBackpack.numOre - blueprint.obsidianRobotOreCost,
          numClay: newBackpack.numClay - blueprint.obsidianRobotClayCost,
          numObsidianRobots: newBackpack.numObsidianRobots + 1,
        });
        break;
      case Robot.GEODE:
        numGeodes = getMaxNumGeodes(memo, blueprint, numMinutes - 1, {
          ...newBackpack,
          numOre: newBackpack.numOre - blueprint.geodeRobotOreCost,
          numObsidian:
            newBackpack.numObsidian - blueprint.geodeRobotObsidianCost,
          numGeodeRobots: newBackpack.numGeodeRobots + 1,
        });
        break;
      case Robot.NONE:
        numGeodes = getMaxNumGeodes(memo, blueprint, numMinutes - 1, {
          ...newBackpack,
        });
        break;
    }
    if (numGeodes > max) {
      max = numGeodes;
    }
  });
  memo[backpackKey] = max;
  if (max > memo.globalMax) memo.globalMax = max;
  return max;
};

const getBlueprintQuality = (
  blueprint: Blueprint,
  numMinutes: number,
): number => {
  const maxGeodes = getMaxNumGeodes(
    { globalMax: 0 },
    blueprint,
    numMinutes,
    getInitialBackpack(),
  );

  return maxGeodes * blueprint.id;
};

export const day19 = (input: string[], numMinutes: number) => {
  const blueprints = parseBlueprints(input);
  return sumArr(blueprints, (blueprint) =>
    getBlueprintQuality(blueprint, numMinutes),
  );
};

export const day19part2 = (input: string[], numMinutes: number) => {
  const blueprints = parseBlueprints(input).slice(0, 3);
  const maxes = blueprints.map((blueprint) =>
    getMaxNumGeodes(
      { globalMax: 0 },
      blueprint,
      numMinutes,
      getInitialBackpack(),
    ),
  );

  return maxes[0] * maxes[1] * (maxes[2] ?? 1);
};
