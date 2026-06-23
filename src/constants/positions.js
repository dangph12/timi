export const LAYER_ORDER = [
  'hair_bottom',
  'version',
  'packaging',
  'eyes',
  'lip',
  'accessory',
  'hair',
  'clothes',
  'accessory_top',
  'item'
];

export const POSITION_OFFSETS = {
  standard: {
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.2, scale: 1 },
    hair_bottom: { x: 0, y: -0.2, scale: 1 },
    eyes: { x: 0, y: -0.16, scale: 0.55 },
    lip: { x: 0, y: -0.03, scale: 0.15 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  },
  economy: {
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.1, scale: 0.6 },
    hair_bottom: { x: 0, y: -0.1, scale: 0.6 },
    eyes: { x: 0, y: 0.1, scale: 0.65 },
    lip: { x: 0, y: 0.35, scale: 0.18 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  }
};

export const CLOTHES_OFFSETS = {
  standard: {
    C01: { x: 0, y: 0.44, scale: 0.8 },
    C02: { x: 0, y: 0.18, scale: 1 },
    C03: { x: 0, y: 0.18, scale: 1 },
    C04: { x: 0, y: 0.17, scale: 1 },
    C05: { x: 0, y: 0.42, scale: 0.7 },
    C06: { x: 0, y: 0.16, scale: 1 },
    C07: { x: 0, y: 0.26, scale: 1 },
    C08: { x: 0, y: 0.16, scale: 1 },
    C09: { x: 0, y: 0.37, scale: 0.8 }
  }
};

export const ACCESSORY_OFFSETS = {
  standard: {
    A01: { x: 0, y: 0.48, scale: 0.55 },
    A02: { x: 0, y: 0.48, scale: 0.55 },
    A03: { x: 0, y: 0.3, scale: 0.35 },
    A04: { x: 0.65, y: 0.3, scale: 0.35 },
    A05: { x: 0.65, y: 0.3, scale: 0.35 },
    A06: { x: 0.65, y: 0.3, scale: 0.35 },
    A07: { x: 0.65, y: 0.3, scale: 0.35 },
    A08: { x: 0, y: -0.09, scale: 0.62 }
  },
  economy: {
    A01: { x: 0.65, y: 0.3, scale: 0.35 },
    A02: { x: 0.65, y: 0.3, scale: 0.35 },
    A03: { x: 0.65, y: 0.3, scale: 0.35 },
    A04: { x: 0.65, y: 0.3, scale: 0.35 },
    A05: { x: 0.65, y: 0.3, scale: 0.35 },
    A06: { x: 0.65, y: 0.3, scale: 0.35 },
    A07: { x: 0.65, y: 0.3, scale: 0.35 },
    A08: { x: 0.65, y: 0.3, scale: 0.35 }
  }
};

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
    H04: { x: 0, y: -0.3, scale: 1 },
    H05: { x: 0, y: -0.32, scale: 1 },
    H06: { x: 0, y: -0.32, scale: 1 },
    H07: { x: 0, y: -0.38, scale: 1 },
    H08: { x: 0, y: -0.32, scale: 1 }
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
    H03: { x: 0, y: 0.25, scale: 1.2 },
    H04: { x: 0, y: -0.1, scale: 0.6 },
    H05: { x: 0, y: -0.1, scale: 0.6 },
    H07: { x: 0, y: -0.1, scale: 0.6 }
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
