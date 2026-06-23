export const LAYER_ORDER = [
  'hair_bottom',
  'version',
  'packaging',
  'eyes',
  'lip',
  'hair',
  'clothes',
  'accessory',
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
