import { sumArr } from '../utils/array';

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

// const getRobotOptions = (blueprint: Blueprint, backpack: Backpack) => {
//   const options = [];
//   const maxOre = Math.max(
//     blueprint.oreRobotOreCost,
//     blueprint.clayRobotOreCost,
//     blueprint.obsidianRobotOreCost,
//     blueprint.geodeRobotOreCost,
//   );
//   const skipFactor = 1.5;
//   const skipOre = backpack.numOre > maxOre * skipFactor;
//   const skipClay =
//     backpack.numClay > blueprint.obsidianRobotClayCost * skipFactor;
//   const skipObsidian =
//     backpack.numObsidian > blueprint.geodeRobotObsidianCost * skipFactor;
//   if (
//     blueprint.geodeRobotOreCost <= backpack.numOre &&
//     blueprint.geodeRobotObsidianCost <= backpack.numObsidian
//   )
//     return [Robot.GEODE];
//   if (blueprint.oreRobotOreCost <= backpack.numOre && !skipOre)
//     options.push(Robot.ORE);
//   if (blueprint.clayRobotOreCost <= backpack.numOre && !skipClay)
//     options.push(Robot.CLAY);
//   if (
//     blueprint.obsidianRobotOreCost <= backpack.numOre &&
//     blueprint.obsidianRobotClayCost <= backpack.numClay &&
//     !skipObsidian
//   )
//     options.push(Robot.OBSIDIAN);
//   let numOptions = 0;
//   if (!skipOre) numOptions++;
//   if (!skipClay) numOptions++;
//   if (!skipObsidian) numOptions++;
//   options.push(Robot.NONE);
//   return options;
// };

const getAllAvailableOptions = (
  canMakeOre: boolean,
  canMakeClay: boolean,
  canMakeObsidian: boolean,
) => {
  const options = [Robot.NONE];
  if (canMakeObsidian) options.push(Robot.OBSIDIAN);
  if (canMakeClay) options.push(Robot.CLAY);
  if (canMakeOre) options.push(Robot.ORE);
  return options;
};

const getRobotOptions2 = (
  blueprint: Blueprint,
  backpack: Backpack,
  numMinutes: number,
) => {
  const {
    id,
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
    numGeode,
    numOreRobots,
    numClayRobots,
    numObsidianRobots,
    numGeodeRobots,
  } = backpack;

  /// Options that can be made
  const canMakeGeode =
    geodeRobotOreCost <= numOre && geodeRobotObsidianCost <= numObsidian;
  if (canMakeGeode) return [Robot.GEODE];

  const maxOreRobotsNeeded = Math.max(
    clayRobotOreCost,
    obsidianRobotOreCost,
    geodeRobotOreCost,
  );
  const maxClayRobotsNeeded = obsidianRobotClayCost;
  const maxObsidianRobotsNeeded = geodeRobotObsidianCost;

  const canMakeObsidian =
    obsidianRobotOreCost <= numOre &&
    obsidianRobotClayCost <= numClay &&
    numObsidianRobots < maxObsidianRobotsNeeded;
  const canMakeClay =
    clayRobotOreCost <= numOre && numClayRobots < maxClayRobotsNeeded;
  const canMakeOre =
    oreRobotOreCost <= numOre && numOreRobots < maxOreRobotsNeeded;

  /// EXPECTED supplies at end of time
  const expectedOreAtEnd = numOre + numOreRobots * numMinutes;
  const expectedClayAtEnd = numClay + numClayRobots * numMinutes;
  const expectedObsidianAtEnd = numObsidian + numObsidianRobots * numMinutes;

  //// REQUIREMENTS for an extra geode robot

  const expectedGeodesAtEnd = Math.min(
    Math.floor(expectedObsidianAtEnd / geodeRobotObsidianCost),
    Math.floor(expectedOreAtEnd / geodeRobotOreCost),
  );

  const expectedRemainingObsidian =
    expectedObsidianAtEnd - expectedGeodesAtEnd * geodeRobotObsidianCost;
  const expectedRemainingOre =
    expectedOreAtEnd - expectedGeodesAtEnd * geodeRobotOreCost;

  const robotMakingMinutes = numMinutes - expectedGeodesAtEnd - 1; // making geode in last minute is useless
  const requiredObsidianForExtraGeode =
    geodeRobotObsidianCost - expectedRemainingObsidian;
  const requiredOreForExtraGeode = geodeRobotOreCost - expectedRemainingOre;

  if (robotMakingMinutes < 1) return [Robot.NONE];

  // need to make one obsidian robot and can
  if (
    requiredObsidianForExtraGeode > 0 &&
    requiredObsidianForExtraGeode <= numMinutes - 2
  ) {
    if (canMakeObsidian && obsidianRobotOreCost <= expectedRemainingOre) {
      return [Robot.OBSIDIAN];
    } else if (canMakeObsidian) {
      return [Robot.ORE, Robot.NONE];
    }
  }
  // need one ore robot and can
  if (
    requiredOreForExtraGeode > 0 &&
    requiredOreForExtraGeode <= numMinutes - 2
  ) {
    if (
      canMakeOre &&
      oreRobotOreCost <= expectedRemainingOre + numMinutes - 2
    ) {
      return [Robot.ORE];
    }
  }

  // need to make obsidian robot but can't right now
  if (
    requiredObsidianForExtraGeode > 0 &&
    requiredObsidianForExtraGeode <= numMinutes - 2 &&
    !canMakeObsidian &&
    !(obsidianRobotOreCost <= expectedRemainingOre)
  ) {
    const neededOreForObsidian = obsidianRobotOreCost - expectedRemainingOre;
    const neededClayForObsidian = obsidianRobotClayCost - expectedClayAtEnd;

    // can soon make obsidian robot, wait - RISKY
    // if (neededOreForObsidian <= 0 && neededClayForObsidian <= 0) {
    //   return [Robot.NONE];
    // }

    const options = [];
    if (
      neededOreForObsidian > 0 &&
      neededOreForObsidian + oreRobotOreCost <= numMinutes - 1 &&
      canMakeOre
    ) {
      options.push(Robot.ORE);
    }
    if (
      neededClayForObsidian > 0 &&
      neededClayForObsidian <= numMinutes - 1 &&
      canMakeClay
    ) {
      options.push(Robot.CLAY);
    }
    if (options.length > 0) {
      console.log('OK IT IS USED');
      return options;
    }
  }

  // // need one ore robot but can't right now
  // // if (requiredOreForExtraGeode > 0 && requiredOreForExtraGeode <= numMinutes - 2) {
  // //   return [Robot.NONE];
  // // }

  ///////

  // const maxExtraSupply =
  //   robotMakingMinutes > 0
  //     ? range(robotMakingMinutes).reduce(
  //         (acc, minute) => acc + (numMinutes - minute - 1),
  //         0,
  //       )
  //     : 0;

  // // More than one obsidian robot needed
  // if (requiredObsidianForExtraGeode > 0) {
  //   if (maxExtraSupply < requiredObsidianForExtraGeode) {
  //     return [Robot.NONE];
  //   }
  // }
  // // More than one ore robot needed
  // if (requiredOreForExtraGeode > 0) {
  //   if (maxExtraSupply < requiredOreForExtraGeode) {
  //     return [Robot.NONE];
  //   }
  // }

  return getAllAvailableOptions(canMakeOre, canMakeClay, canMakeObsidian);
};

const getMaxNumGeodes = (
  memo: Record<string, number>,
  blueprint: Blueprint,
  numMinutes: number,
  backpack: Backpack,
  lastRobotOption: Robot,
): number => {
  if (numMinutes === 0) return backpack.numGeode;
  const backpackKey = getBackpackKey(backpack, numMinutes);
  if (memo[backpackKey]) return memo[backpackKey];

  const robotOptions = getRobotOptions2(blueprint, backpack, numMinutes);
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
        numGeodes = getMaxNumGeodes(
          memo,
          blueprint,
          numMinutes - 1,
          {
            ...newBackpack,
            numOre: newBackpack.numOre - blueprint.oreRobotOreCost,
            numOreRobots: newBackpack.numOreRobots + 1,
          },
          robotOption,
        );
        break;
      case Robot.CLAY:
        numGeodes = getMaxNumGeodes(
          memo,
          blueprint,
          numMinutes - 1,
          {
            ...newBackpack,
            numOre: newBackpack.numOre - blueprint.clayRobotOreCost,
            numClayRobots: newBackpack.numClayRobots + 1,
          },
          robotOption,
        );
        break;
      case Robot.OBSIDIAN:
        numGeodes = getMaxNumGeodes(
          memo,
          blueprint,
          numMinutes - 1,
          {
            ...newBackpack,
            numOre: newBackpack.numOre - blueprint.obsidianRobotOreCost,
            numClay: newBackpack.numClay - blueprint.obsidianRobotClayCost,
            numObsidianRobots: newBackpack.numObsidianRobots + 1,
          },
          robotOption,
        );
        break;
      case Robot.GEODE:
        numGeodes = getMaxNumGeodes(
          memo,
          blueprint,
          numMinutes - 1,
          {
            ...newBackpack,
            numOre: newBackpack.numOre - blueprint.geodeRobotOreCost,
            numObsidian:
              newBackpack.numObsidian - blueprint.geodeRobotObsidianCost,
            numGeodeRobots: newBackpack.numGeodeRobots + 1,
          },
          robotOption,
        );
        break;
      case Robot.NONE:
        numGeodes = getMaxNumGeodes(
          memo,
          blueprint,
          numMinutes - 1,
          {
            ...newBackpack,
          },
          robotOption,
        );
        break;
    }
    if (numGeodes > max) {
      max = numGeodes;
    }
  });
  memo[backpackKey] = max;
  return max;
};

const getBlueprintQuality = (
  blueprint: Blueprint,
  numMinutes: number,
): number => {
  const memo: Record<string, number> = {};
  // == Minute 19 ==
  // 1 ore-collecting robot collects 1 ore; you now have 3 ore.
  // 4 clay-collecting robots collect 4 clay; you now have 21 clay.
  // 2 obsidian-collecting robots collect 2 obsidian; you now have 5 obsidian.
  // 1 geode-cracking robot cracks 1 geode; you now have 1 open geode.

  // == Minute 20 == OK
  // 1 ore-collecting robot collects 1 ore; you now have 4 ore.
  // 4 clay-collecting robots collect 4 clay; you now have 25 clay.
  // 2 obsidian-collecting robots collect 2 obsidian; you now have 7 obsidian.
  // 1 geode-cracking robot cracks 1 geode; you now have 2 open geodes.
  // const maxGeodes = getMaxNumGeodes(memo, blueprint, 5, {
  //   numOre: 3,
  //   numClay: 21,
  //   numObsidian: 5,
  //   numGeode: 1,
  //   numOreRobots: 1,
  //   numClayRobots: 4,
  //   numObsidianRobots: 2,
  //   numGeodeRobots: 1,
  // });
  console.log({ blueprint });
  const maxGeodes = getMaxNumGeodes(
    memo,
    blueprint,
    numMinutes,
    getInitialBackpack(),
    0,
  );

  console.log({ maxGeodes, id: blueprint.id });
  return maxGeodes * blueprint.id;
};

export const day19 = (input: string[], numMinutes: number) => {
  const blueprints = parseBlueprints(input);
  return sumArr(blueprints, (blueprint) =>
    getBlueprintQuality(blueprint, numMinutes),
  );
};

export const day19part2 = (input: string[]) => {
  return 19;
};
