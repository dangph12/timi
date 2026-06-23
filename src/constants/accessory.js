export const ACCESSORIES = [
  { id: 'A01', label: 'Accessory A01' },
  { id: 'A02', label: 'Accessory A02' },
  { id: 'A03', label: 'Accessory A03' },
  { id: 'A04', label: 'Accessory A04' },
  { id: 'A05', label: 'Accessory A05' },
  { id: 'A06', label: 'Accessory A06' },
  { id: 'A07', label: 'Accessory A07' },
  { id: 'A08', label: 'Accessory A08' }
];

export const ACCESSORY_OFFSETS = {
  standard: {
    A01: { x: 0, y: 0.48, scale: 0.58 },
    A02: { x: 0, y: 0.48, scale: 0.58 },
    A03: { x: -0.3, y: 0.2, scale: 0.25 },
    A04: { x: 0.3, y: 0.2, scale: 0.25 },
    A05: { x: 0, y: -0.42, scale: 1 },
    A06: { x: 0, y: -0.42, scale: 1 },
    A07: { x: 0.35, y: -0.3, scale: 0.25 },
    A08: { x: 0.02, y: -0.1, scale: 1 }
  },
  economy: {
    A05: { x: 0, y: -0.4, scale: 1.1 },
    A06: { x: 0, y: -0.4, scale: 1.1 },
    A07: { x: 0.35, y: -0.32, scale: 0.3 },
    A08: { x: 0.02, y: 0.24, scale: 1.2 }
  }
};

export const ACCESSORY_MUTEX_GROUPS = [
  ['A01', 'A02'],
  ['A05', 'A06']
];
