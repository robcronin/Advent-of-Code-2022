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
  valves: Valves;
  location: string;
  timeLeftAfterMove: number;
  turnedOn?: string;
};

const getMaxPressure2 = (
  valves: Valves,
  location: string,
  elephantLocation: string,
  currentPressure: number,
  currentTimeLeft: number,
  elephantTimeLeft: number,
): number => {
  if (currentTimeLeft <= 1 && elephantTimeLeft <= 1) return currentPressure;
  const memoString = `${location}-${elephantLocation}-${currentTimeLeft}-${elephantTimeLeft}-${currentPressure}-${getOnString(
    valves,
  )}`;
  if (memo[memoString]) return memo[memoString];
  const currentValve = valves[location];
  const elephantValve = valves[elephantLocation];
  const myOptions: Option[] = [];
  const elephantOptions: Option[] = [];
  if (
    !currentValve.on &&
    currentValve.flowRate > 0 &&
    currentTimeLeft >= elephantTimeLeft &&
    currentTimeLeft > 0
  ) {
    if (currentTimeLeft >= 0) {
      // on, move, on, effect,
      currentValve.leads.forEach((lead) => {
        const newValves = {
          ...valves,
          [location]: { ...currentValve, on: true },
        };
        const timeLeftAfterMove = currentTimeLeft - 1 - lead.steps;
        myOptions.push({
          valves: newValves,
          location: lead.id,
          timeLeftAfterMove,
          turnedOn: currentValve.id,
        });
      });
    }
  }
  if (
    !elephantValve.on &&
    elephantValve.flowRate > 0 &&
    elephantTimeLeft >= currentTimeLeft &&
    elephantTimeLeft > 0
  ) {
    if (elephantTimeLeft >= 0) {
      // on, move, on, effect,
      elephantValve.leads.forEach((lead) => {
        const newValves = {
          ...valves,
          [location]: { ...elephantValve, on: true },
        };
        const timeLeftAfterMove = elephantTimeLeft - 1 - lead.steps;
        elephantOptions.push({
          valves: newValves,
          location: lead.id,
          timeLeftAfterMove,
          turnedOn: elephantValve.id,
        });
      });
    }
  }
  if (
    currentTimeLeft - 1 - 1 - 1 >= 0 &&
    currentTimeLeft >= elephantTimeLeft &&
    currentTimeLeft > 0
  ) {
    currentValve.leads.forEach((lead) => {
      const newValves = {
        ...valves,
      };
      const timeLeftAfterMove = currentTimeLeft - lead.steps;

      myOptions.push({
        valves: newValves,
        location: lead.id,
        timeLeftAfterMove,
      });
    });
  }
  if (
    elephantTimeLeft - 1 - 1 - 1 >= 0 &&
    elephantTimeLeft >= currentTimeLeft &&
    elephantTimeLeft > 0
  ) {
    elephantValve.leads.forEach((lead) => {
      const newValves = {
        ...valves,
      };
      const timeLeftAfterMove = elephantTimeLeft - lead.steps;

      elephantOptions.push({
        valves: newValves,
        location: lead.id,
        timeLeftAfterMove,
      });
    });
  }
  if (myOptions.length === 0) {
    myOptions.push({
      valves: { ...valves },
      location: currentValve.id,
      timeLeftAfterMove: currentTimeLeft,
    });
  }
  if (elephantOptions.length === 0) {
    elephantOptions.push({
      valves: { ...valves },
      location: elephantValve.id,
      timeLeftAfterMove: elephantTimeLeft,
    });
  }
  let max = 0;
  myOptions.forEach((myOption) => {
    elephantOptions.forEach((elephantOption) => {
      if (
        myOption.location === 'DD' &&
        myOption.timeLeftAfterMove === 4 &&
        !myOption.turnedOn &&
        elephantOption.location === 'JJ' &&
        elephantOption.timeLeftAfterMove === 3 &&
        !elephantOption.turnedOn
      ) {
        console.log('HAHAHAHALA');
      }
      const combinedValves = { ...myOption.valves };
      Object.keys(combinedValves).forEach((valveKey) => {
        if (elephantOption.valves[valveKey].on) {
          combinedValves[valveKey].on = true;
        }
      });
      const sameTurnOn =
        myOption.turnedOn &&
        elephantOption.turnedOn &&
        myOption.turnedOn === elephantOption.turnedOn;
      if (!sameTurnOn) {
        const myPressureHere = myOption.turnedOn
          ? currentValve.flowRate * (currentTimeLeft - 1)
          : 0;
        const elephantPressureHere = elephantOption.turnedOn
          ? elephantValve.flowRate * (elephantTimeLeft - 1)
          : 0;
        const turnOnMax =
          myPressureHere + elephantPressureHere + currentPressure;
        if (turnOnMax > max) max = turnOnMax;

        const potentialPressure =
          myOption.timeLeftAfterMove >= 1 ||
          elephantOption.timeLeftAfterMove >= 1
            ? getMaxPressure2(
                combinedValves,
                myOption.location,
                elephantOption.location,
                turnOnMax,
                myOption.timeLeftAfterMove > 0 ? myOption.timeLeftAfterMove : 0,
                elephantOption.timeLeftAfterMove > 0
                  ? elephantOption.timeLeftAfterMove
                  : 0,
              )
            : 0;
        if (
          myOption.location === 'DD' &&
          myOption.timeLeftAfterMove === 4 &&
          !myOption.turnedOn &&
          elephantOption.location === 'JJ' &&
          elephantOption.timeLeftAfterMove === 3 &&
          !elephantOption.turnedOn
        ) {
          console.log(
            combinedValves,
            myOption.location,
            elephantOption.location,
            turnOnMax,
            myOption.timeLeftAfterMove > 0 ? myOption.timeLeftAfterMove : 0,
            elephantOption.timeLeftAfterMove > 0
              ? elephantOption.timeLeftAfterMove
              : 0,
          );
        }
        if (potentialPressure > max) max = potentialPressure;
      }
    });
  });

  memo[memoString] = max;
  return max;
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
  const reducedValves = reduceValves(valves, time, 'AA');
  return getMaxPressure2(reducedValves, 'AA', 'AA', 0, time, time);
};
