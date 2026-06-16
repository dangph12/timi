export const LAYER_ORDER = [
  'packaging',
  'eyes',
  'lip',
  'accessory',
  'hair',
  'clothes',
  'version',
  'item'
];

export const POSITION_OFFSETS = {
  standard: {
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.1, scale: 0.6 },
    eyes: { x: 0, y: -0.16, scale: 0.55 },
    lip: { x: 0, y: -0.03, scale: 0.15 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  },
  economy: {
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.1, scale: 0.6 },
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
