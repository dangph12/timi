export const HAIR_OFFSETS = {
  standard: {
    H01: { x: 0.03, y: -0.36, scale: 1.2 },
    H02: { x: 0, y: -0.23, scale: 1.2 },
    H03: { x: 0, y: -0.23, scale: 1.2 },
    H04: { x: 0, y: -0.3, scale: 1 },
    H05: { x: 0, y: -0.32, scale: 1 },
    H06: { x: 0, y: -0.32, scale: 1 },
    H07: { x: 0, y: -0.38, scale: 1 },
    H08: { x: 0, y: -0.32, scale: 1 }
  },
  economy: {
    H01: { x: 0.03, y: -0.25, scale: 1.2 },
    H02: { x: 0.005, y: -0.08, scale: 1.2 },
    H03: { x: 0, y: -0.17, scale: 1.2 },
    H04: { x: 0, y: -0.23, scale: 1.1 },
    H05: { x: 0, y: -0.23, scale: 1.1 },
    H06: { x: 0, y: -0.23, scale: 1.1 },
    H07: { x: 0, y: -0.3, scale: 1.1 },
    H08: { x: 0, y: -0.23, scale: 1.1 }
  }
};

export const HAIR_BOTTOM_OFFSETS = {
  standard: {
    H01: { x: 0, y: -0.2, scale: 1.1 },
    H02: { x: 0, y: -0.23, scale: 1.1 },
    H03: { x: 0, y: -0.1, scale: 1.1 },
    H04: { x: 0, y: 0, scale: 1 },
    H05: { x: 0, y: -0.22, scale: 1.1 },
    H07: { x: 0, y: -0.18, scale: 1 }
  },
  economy: {
    H01: { x: 0, y: 0.1, scale: 1 },
    H02: { x: 0, y: 0.15, scale: 0.9 },
    H03: { x: 0, y: 0.2, scale: 1.1 },
    H04: { x: 0, y: -0.13, scale: 1.1 },
    H05: { x: 0, y: -0.15, scale: 1.1 },
    H07: { x: 0, y: 0.02, scale: 1.1 }
  }
};

export const HAIR_OPTIONS = [
  { id: 'H01', label: 'Hair H01', hasBottom: true },
  { id: 'H02', label: 'Hair H02', hasBottom: true },
  { id: 'H03', label: 'Hair H03', hasBottom: true },
  { id: 'H04', label: 'Hair H04', hasBottom: true },
  { id: 'H05', label: 'Hair H05', hasBottom: true },
  { id: 'H06', label: 'Hair H06', hasBottom: false },
  { id: 'H07', label: 'Hair H07', hasBottom: true },
  { id: 'H08', label: 'Hair H08', hasBottom: false }
];
