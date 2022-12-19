import { sumArr } from '../utils/array';
import { range } from '../utils/looping';

type Lead = { id: string; steps: number };
type Valve = {
  id: string;
  flowRate: number;
  leads: Lead[];
  on: boolean;
};
type Valves = Record<string, Valve>;
let memo: Record<string, number> = {};

const parseValves = (input: string[]): Valves =>
  input.reduce((acc, line) => {
    const groups = line.match(
      new RegExp(
        'Valve ([A-Z]+) has flow rate=([0-9]+); tunnels? leads? to valves? ([A-Z, ]+)',
      ),
    );
    if (!groups) throw new Error(`Invalid sensor: ${line}`);
    const [_, id, flowRate, leadsString] = groups;
    const leads = leadsString
      .split(', ')
      .map((lead) => ({ id: lead, steps: 1 }));
    return { ...acc, [id]: { id, flowRate: +flowRate, leads, on: false } };
  }, {});

// Don't judge me on this monstrosity
const reduceValves = (valves: Valves, numMinutes: number, keepId: string) => {
  let changesMade = true;
  let newValves: Valves = { ...valves };
  let count = 0;
  while (changesMade && count <= numMinutes) {
    changesMade = false;
    count++;
    const newValveValues = Object.values(newValves)
      .map((valve) => {
        const newLeads = valve.leads
          .map((lead) => {
            if (newValves[lead.id] && newValves[lead.id].flowRate === 0) {
              changesMade = true;
              return newValves[lead.id].leads.map((nextLead) => {
                return {
                  ...nextLead,
                  steps: nextLead.steps + lead.steps,
                };
              });
            }
            return lead;
          })
          .flat()
          .filter((lead) => lead.id !== valve.id);
        const reducedLeads: Lead[] = newLeads
          .filter(
            (newLead) =>
              !newLeads.some(
                (lead) => lead.id === newLead.id && newLead.steps > lead.steps,
              ),
          )
          .reduce((acc: Lead[], lead) => {
            if (!acc.find((accLead) => accLead.id === lead.id)) {
              return [...acc, lead];
            }
            return acc;
          }, []);

        return { ...valve, leads: reducedLeads };
      })
      .filter((valve) => valve.leads.length > 0);
    newValves = newValveValues.reduce(
      (acc, valve) => ({ ...acc, [valve.id]: valve }),
      {},
    );
  }
  const finalValveValues = Object.values(newValves)
    .filter((valve) => valve.id === keepId || valve.flowRate > 0)
    .map((valve) => {
      const validLeads = valve.leads.filter((lead) => lead.steps < numMinutes);
      return { ...valve, leads: validLeads };
    });
  return finalValveValues.reduce(
    (acc, valve) => ({ ...acc, [valve.id]: valve }),
    {},
  );
};

const getOnString = (valves: Valves) =>
  Object.values(valves)
    .reduce((acc: string[], valve) => {
      if (valve.on) return [...acc, valve.id];
      return acc;
    }, [])
    .sort((a, b) => (a > b ? 1 : -1))
    .toString();

const getAllOn = (valves: Valves): boolean =>
  Object.values(valves).every((valve) => valve.on);

const deepCopyValves = (valves: Valves): Valves =>
  Object.keys(valves).reduce(
    (acc: Valves, key) => ({ ...acc, [key]: { ...valves[key] } }),
    {},
  );

const getMaxPressure = (
  valves: Valves,
  location: string,
  currentPressure: number,
  currentTimeLeft: number,
): number => {
  if (currentTimeLeft <= 1) return currentPressure;
  const memoString = `${location}-${currentTimeLeft}-${currentPressure}-${getOnString(
    valves,
  )}`;
  if (memo[memoString]) return memo[memoString];
  const currentValve = valves[location];
  let onMax = 0;
  let offMax = 0;
  if (!currentValve.on) {
    const pressureHere = currentValve.flowRate * (currentTimeLeft - 1);
    onMax = pressureHere + currentPressure;
    if (currentTimeLeft - 1 - 1 - 1 - 1 >= 0) {
      // on, move, on, effect,
      currentValve.leads.forEach((lead) => {
        const newValves = {
          ...valves,
          [location]: { ...currentValve, on: true },
        };
        const timeLeftAfterMove = currentTimeLeft - 1 - lead.steps;

        const potentialPressure =
          timeLeftAfterMove > 1
            ? getMaxPressure(
                newValves,
                lead.id,
                currentPressure + pressureHere,
                timeLeftAfterMove,
              )
            : 0;
        if (potentialPressure > onMax) onMax = potentialPressure;
      });
    }
  }
  if (currentTimeLeft - 1 - 1 - 1 >= 0) {
    currentValve.leads.forEach((lead) => {
      const newValves = {
        ...valves,
      };
      const timeLeftAfterMove = currentTimeLeft - lead.steps;

      const potentialPressure =
        timeLeftAfterMove > 1
          ? getMaxPressure(
              newValves,
              lead.id,
              currentPressure,
              timeLeftAfterMove,
            )
          : 0;
      if (potentialPressure > offMax) offMax = potentialPressure;
    });
  }
  const ret = Math.max(onMax, offMax);
  memo[memoString] = ret;
  return ret;
};

type Option = {
  turnOn?: string;
  moveTo?: string;
  weight: number;
};
type Path = Option & { pressure: number; valves: Valves };

const getOptions = (
  valves: Valves,
  location: string,
  sameLoc?: boolean,
): Option[] => {
  const valve = valves[location];
  const options: Option[] = [];
  if (!valve.on && valve.flowRate > 0 && !sameLoc) {
    options.push({ turnOn: location, weight: valve.flowRate });
  }
  valve.leads.forEach((lead) => {
    const leadValve = valves[lead.id];
    options.push({
      moveTo: leadValve.id,
      weight: 1 + (!leadValve.on ? leadValve.flowRate : 0),
    });
  });
  return options;
};

const chooseOption = (options: Option[]): Option => {
  const totalWeight = sumArr(options, (option) => option.weight);
  const rand = Math.random() * totalWeight;
  let sum = 0;
  const result = options.find((option) => {
    sum += option.weight;
    return rand <= sum;
  });
  if (!result) throw new Error('chooseOption failed');
  return result;
};

const chooseParent = (paths: FullPath[]): FullPath => {
  const totalWeight = sumArr(paths, (path) => path.pressure);
  const rand = Math.random() * totalWeight;
  let sum = 0;
  const result = paths.find((path) => {
    sum += path.pressure;
    return rand <= sum;
  });
  if (!result) throw new Error('chooseParent failed');
  return result;
};

type FullPath = {
  myPath: Path[];
  elephantPath: Path[];
  pressure: number;
};

const generatePath = (
  givenValves: Valves,
  time: number,
  startPos?: {
    myLocation: string;
    elephantLocation: string;
    timeLeft: number;
    pressure: number;
    myPath: Path[];
    elephantPath: Path[];
  },
): FullPath => {
  const valves = deepCopyValves(givenValves);
  let myLocation = startPos?.myLocation ?? 'AA';
  let elephantLocation = startPos?.elephantLocation ?? 'AA';
  let timeLeft = startPos?.timeLeft ?? time;
  let pressure = startPos?.pressure ?? 0;
  let myPath: Path[] = startPos?.myPath ?? [];
  let elephantPath: Path[] = startPos?.elephantPath ?? [];

  while (!getAllOn(valves) && timeLeft > 0) {
    const myValve = valves[myLocation];
    const elephantValve = valves[elephantLocation];
    const myOptions = getOptions(valves, myLocation);
    const elephantOptions = getOptions(
      valves,
      elephantLocation,
      myLocation === elephantLocation,
    );
    const myOption = chooseOption(myOptions);
    const elephantOption = chooseOption(elephantOptions);
    if (myOption.turnOn) {
      pressure += myValve.flowRate * (timeLeft - 1);
      valves[myLocation].on = true;
    } else if (myOption.moveTo) {
      myLocation = myOption.moveTo;
    }
    if (elephantOption.turnOn) {
      pressure += elephantValve.flowRate * (timeLeft - 1);
      valves[elephantLocation].on = true;
    } else if (elephantOption.moveTo) {
      elephantLocation = elephantOption.moveTo;
    }
    myPath.push({ ...myOption, pressure, valves: deepCopyValves(valves) });
    elephantPath.push({
      ...elephantOption,
      pressure,
      valves: deepCopyValves(valves),
    });
    timeLeft -= 1;
  }
  return { myPath, elephantPath, pressure };
};

export const day16 = (input: string[], time: number) => {
  memo = {};
  const valves = parseValves(input);
  const reducedValves = reduceValves(valves, time, 'AA');
  return getMaxPressure(reducedValves, 'AA', 0, time);
};
export const day16part2 = (input: string[], time: number) => {
  memo = {};
  const valves = parseValves(input);
  let max = 0;
  // let max = 2166;
  const poolSize = time * 5;
  const prePoolSample = 1 * time;
  const poolThreshold = 0.5;
  const geneticIncreaseThreshold = time * 5000;
  let timeSinceIncrease = 0;
  range(prePoolSample).forEach(() => {
    const path = generatePath(valves, time);
    if (path.pressure > max) {
      max = path.pressure;
    }
  });
  console.log('pre pool creation max', max);
  let pool = [];
  while (pool.length < poolSize) {
    const path = generatePath(valves, time);
    if (path.pressure > max) {
      max = path.pressure;
    }
    if (path.pressure > max * poolThreshold) {
      pool.push(path);
    }
  }
  pool.sort((a, b) => b.pressure - a.pressure);
  // console.log({ pool });
  console.log('max at pre mutation point', max);
  while (timeSinceIncrease < geneticIncreaseThreshold) {
    // const parentIndex = Math.floor(poolSize * Math.random());
    // const parent = pool[parentIndex];
    const parent = chooseParent(pool);
    const mutationIndex =
      Math.floor((parent.myPath.length - 1) * Math.random()) + 1;
    const myPath = parent.myPath.slice(0, mutationIndex);
    const elephantPath = parent.elephantPath.slice(0, mutationIndex);
    const myLocation =
      myPath[myPath.length - 1].turnOn ||
      (myPath[myPath.length - 1].moveTo as string);
    const elephantLocation =
      elephantPath[elephantPath.length - 1].turnOn ||
      (elephantPath[elephantPath.length - 1].moveTo as string);
    const startPoint = {
      myLocation,
      elephantLocation,
      timeLeft: time - mutationIndex,
      pressure: myPath[myPath.length - 1].pressure,
      myPath: parent.myPath.slice(0, mutationIndex),
      elephantPath: parent.elephantPath.slice(0, mutationIndex),
    };
    // console.log({ mutationIndex, startPoint });
    const path = generatePath(
      deepCopyValves(myPath[myPath.length - 1].valves),
      startPoint.timeLeft,
      startPoint,
    );
    // console.log({ path });
    if (path.pressure > max) {
      max = path.pressure;
      console.log('new max in genetic', max);
      timeSinceIncrease = 0;
    } else {
      timeSinceIncrease++;
    }
    // if (path.pressure > pool[pool.length - 1].pressure) {
    pool.pop();
    pool.push(path);
    pool.sort((a, b) => b.pressure - a.pressure);
    // }
  }
  console.log('max at post mutation point', max);

  return max;
};
