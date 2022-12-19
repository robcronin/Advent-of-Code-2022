const a = {
  AA: {
    id: 'AA',
    flowRate: 0,
    leads: [
      { id: 'DD', steps: 1 },
      { id: 'JJ', steps: 2 },
      { id: 'BB', steps: 1 },
    ],
    on: false,
  },
  BB: {
    id: 'BB',
    flowRate: 13,
    leads: [
      { id: 'CC', steps: 1 },
      { id: 'DD', steps: 2 },
      { id: 'JJ', steps: 3 },
    ],
    on: false,
  },
  CC: {
    id: 'CC',
    flowRate: 2,
    leads: [
      { id: 'DD', steps: 1 },
      { id: 'BB', steps: 1 },
    ],
    on: false,
  },
  DD: {
    id: 'DD',
    flowRate: 20,
    leads: [
      { id: 'CC', steps: 1 },
      { id: 'JJ', steps: 3 },
      { id: 'BB', steps: 2 },
      { id: 'EE', steps: 1 },
    ],
    on: false,
  },
  EE: {
    id: 'EE',
    flowRate: 3,
    leads: [
      { id: 'HH', steps: 3 },
      { id: 'DD', steps: 1 },
    ],
    on: false,
  },
  HH: { id: 'HH', flowRate: 22, leads: [{ id: 'EE', steps: 3 }], on: false },
  JJ: {
    id: 'JJ',
    flowRate: 21,
    leads: [
      { id: 'DD', steps: 3 },
      { id: 'BB', steps: 3 },
    ],
    on: false,
  },
};
