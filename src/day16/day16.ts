type Lead = { id: string; steps: number };
type Valve = {
  id: string;
  flowRate: number;
  leads: Lead[];
};
type Valves = Record<string, Valve>;
type Memo = Record<string, number>;
type Option = {
  location: string;
  timeLeftAfterMove: number;
  turnedOn?: string;
  onValves: string[];
};
type MaxPressureInput = {
  memo?: Memo;
  valves: Valves;
  myLocation?: string;
  elephantLocation?: string;
  currentPressure?: number;
  myTimeLeft: number;
  elephantTimeLeft?: number;
  onValves?: string[];
};

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
    return { ...acc, [id]: { id, flowRate: +flowRate, leads } };
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

const getUpperBound = (
  valves: Valves,
  onValves: string[],
  currentPressure: number,
  startingMyTimeLeft: number,
  startingElephantTimeLeft: number = 0,
) => {
  const sorted = Object.values(valves)
    .filter((valve) => !onValves.includes(valve.id))
    .map((valve) => valve.flowRate)
    .sort((a, b) => a - b);

  let upperBound = currentPressure;
  let myTimeLeft = startingMyTimeLeft;
  let elephantTimeLeft = startingElephantTimeLeft;
  let valvesLeft = sorted.length;
  while (valvesLeft > 0 && (myTimeLeft > 1 || elephantTimeLeft > 1)) {
    const myTimeAfter = myTimeLeft - 1;
    const elephantTimeAfter = elephantTimeLeft - 1;
    if (myTimeAfter > 0) {
      upperBound += myTimeAfter * sorted[valvesLeft - 1];
      myTimeLeft -= 2;
      valvesLeft--;
    }
    if (elephantTimeAfter > 0) {
      upperBound += elephantTimeAfter * sorted[valvesLeft - 1];
      elephantTimeLeft -= 2;
      valvesLeft--;
    }
  }
  return upperBound;
};

const getAllOn = (valves: Valves, onValves: string[]): boolean =>
  Object.keys(valves).length - 1 === onValves.length;

const getPersonOptions = (
  onValves: string[],
  valve: Valve,
  location: string,
  timeLeft: number,
  otherTimeLeft: number,
) => {
  const options: Option[] = [];
  if (
    !onValves.includes(location) &&
    valve.flowRate > 0 &&
    timeLeft >= otherTimeLeft &&
    timeLeft >= 2
  ) {
    valve.leads.forEach((lead) => {
      const timeLeftAfterMove = timeLeft - 1 - lead.steps;
      options.push({
        location: lead.id,
        timeLeftAfterMove,
        turnedOn: valve.id,
        onValves: [...onValves, location],
      });
    });
  }
  if (timeLeft >= 3 && timeLeft >= otherTimeLeft) {
    valve.leads.forEach((lead) => {
      const timeLeftAfterMove = timeLeft - lead.steps;
      options.push({
        location: lead.id,
        timeLeftAfterMove,
        onValves: [...onValves],
      });
    });
  }
  return options;
};

const getAllOptions = (
  onValves: string[],
  myValve: Valve,
  elephantValve: Valve,
  myLocation: string,
  elephantLocation: string,
  myTimeLeft: number,
  elephantTimeLeft: number,
) => {
  const myOptions = getPersonOptions(
    onValves,
    myValve,
    myLocation,
    myTimeLeft,
    elephantTimeLeft,
  );
  const elephantOptions = getPersonOptions(
    onValves,
    elephantValve,
    elephantLocation,
    elephantTimeLeft,
    myTimeLeft,
  );

  if (myOptions.length === 0 && elephantOptions.length > 0) {
    myOptions.push({
      location: myValve.id,
      timeLeftAfterMove: myTimeLeft,
      onValves: [...onValves],
    });
  }
  if (elephantOptions.length === 0 && myOptions.length > 0) {
    elephantOptions.push({
      location: elephantValve.id,
      timeLeftAfterMove: elephantTimeLeft,
      onValves: [...onValves],
    });
  }
  return { myOptions, elephantOptions };
};

const getMaxPressure = ({
  memo = { globalMax: 0 },
  valves,
  myLocation = 'AA',
  elephantLocation = 'AA',
  currentPressure = 0,
  myTimeLeft,
  elephantTimeLeft = 0,
  onValves = [],
}: MaxPressureInput): number => {
  // early return cases
  if (myTimeLeft <= 1 && elephantTimeLeft <= 1) return currentPressure;
  if (getAllOn(valves, onValves)) return currentPressure;
  const memoString = `${myLocation}-${elephantLocation}-${myTimeLeft}-${elephantTimeLeft}-${currentPressure}}`;
  if (memo[memoString]) return memo[memoString];
  const reverseString = `${elephantLocation}-${myLocation}-${elephantTimeLeft}-${myTimeLeft}-${currentPressure}}`;
  if (memo[reverseString]) return memo[reverseString];

  // upper bound check
  const upperBound = getUpperBound(
    valves,
    onValves,
    currentPressure,
    myTimeLeft,
    elephantTimeLeft,
  );
  if (upperBound < memo.globalMax) {
    memo[memoString] = currentPressure;
    return currentPressure;
  }

  // get possible options from here
  const myValve = valves[myLocation];
  const elephantValve = valves[elephantLocation];
  const { myOptions, elephantOptions } = getAllOptions(
    onValves,
    myValve,
    elephantValve,
    myLocation,
    elephantLocation,
    myTimeLeft,
    elephantTimeLeft,
  );

  // find max pressure from here
  let max = 0;
  myOptions.forEach((myOption) => {
    elephantOptions.forEach((elephantOption) => {
      const combinedOnValves = [...myOption.onValves];
      elephantOption.onValves.forEach((onValve) => {
        if (!combinedOnValves.includes(onValve)) combinedOnValves.push(onValve);
      });

      const sameTurnOn =
        myOption.turnedOn &&
        elephantOption.turnedOn &&
        myOption.turnedOn === elephantOption.turnedOn;
      if (!sameTurnOn) {
        const myPressureHere = myOption.turnedOn
          ? myValve.flowRate * (myTimeLeft - 1)
          : 0;
        const elephantPressureHere = elephantOption.turnedOn
          ? elephantValve.flowRate * (elephantTimeLeft - 1)
          : 0;
        const turnOnMax =
          myPressureHere + elephantPressureHere + currentPressure;
        if (turnOnMax > max) max = turnOnMax;

        const potentialPressure =
          myOption.timeLeftAfterMove >= 2 ||
          elephantOption.timeLeftAfterMove >= 2
            ? getMaxPressure({
                memo,
                valves,
                myLocation: myOption.location,
                elephantLocation: elephantOption.location,
                currentPressure: turnOnMax,
                myTimeLeft:
                  myOption.timeLeftAfterMove > 0
                    ? myOption.timeLeftAfterMove
                    : 0,
                elephantTimeLeft:
                  elephantOption.timeLeftAfterMove > 0
                    ? elephantOption.timeLeftAfterMove
                    : 0,
                onValves: [...combinedOnValves],
              })
            : 0;

        if (potentialPressure > max) max = potentialPressure;
      }
    });
  });

  memo[memoString] = max;
  if (max > memo.globalMax) memo.globalMax = max;
  return max;
};

export const day16 = (input: string[], time: number) => {
  const valves = parseValves(input);
  const reducedValves = reduceValves(valves, time, 'AA');
  return getMaxPressure({ valves: reducedValves, myTimeLeft: time });
};
export const day16part2 = (input: string[], time: number) => {
  const valves = parseValves(input);
  const reducedValves = reduceValves(valves, time, 'AA');
  return getMaxPressure({
    valves: reducedValves,
    myTimeLeft: time,
    elephantTimeLeft: time,
  });
};
