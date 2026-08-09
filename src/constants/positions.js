export const LAYER_ORDER = [
  'hair_bottom',
  'version',
  'packaging',
  'eyes',
  'lip',
  'hair',
  'accessory',
  'clothes',
  'item'
];

export const POSITION_OFFSETS = {
  standard: {
    version: { x: 0, y: 0.2, scale: 1 },
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.2, scale: 1 },
    hair_bottom: { x: 0, y: -0.2, scale: 1 },
    eyes: { x: 0, y: -0.14, scale: 0.65 },
    lip: { x: 0, y: -0.03, scale: 0.15 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  },
  economy: {
    version: { x: 0, y: 0, scale: 1 },
    clothes: { x: 0, y: 0.55, scale: 1 },
    hair: { x: 0, y: -0.1, scale: 0.6 },
    hair_bottom: { x: 0, y: -0.1, scale: 0.6 },
    eyes: { x: 0, y: 0.2, scale: 0.65 },
    lip: { x: 0, y: 0.35, scale: 0.18 },
    accessory: { x: 0.65, y: 0.3, scale: 0.35 },
    item: { x: 0.8, y: 0.6, scale: 0.4 },
    packaging: { x: 0, y: 0, scale: 1.1 }
  }
};

export const CHARACTER_PACKAGING_TRANSFORM = {
  yRatio: 0.25,
  rotation: 18
};

export const ITEM_TYPE_PACKAGING_IMAGES = {
  keychain: '/packaging/10.png',
  magnet: '/packaging/11.png',
  badges: '/packaging/13.png',
  'luggage-tag': '/packaging/12.png'
};

export const DIY_BOX_VERSION_IMAGES = {
  standard: {
    background: '/packaging/4.png',
    body: '/packaging/2.png'
  },
  economy: {
    background: '/packaging/5.png',
    body: '/packaging/3.png'
  }
};

export const DIY_BOX_BACKGROUND_POSITION = {
  cxRatio: 0.52,
  cyRatio: 0.82,
  maxWRatio: 0.3,
  maxHRatio: 0.38,
  rotation: 0
};

export const DIY_BOX_BODY_POSITION = {
  cxRatio: 0.83,
  cyRatio: 0.82,
  maxWRatio: 0.3,
  maxHRatio: 0.38,
  rotation: 0
};

export const PACKAGING_SCENE_ITEMS = {
  'default-box': [
    {
      src: '/packaging/DEFAULT BOX.png',
      cxRatio: 0.25,
      cyRatio: 0.55,
      maxWRatio: 0.82,
      maxHRatio: 0.72,
      rotation: -10
    },
     {
      src: '/packaging/10.png',
      cxRatio: 0.54,
      cyRatio: 0.49,
      maxWRatio: 0.26,
      maxHRatio: 0.35,
      rotation: -15
    },
    {
      src: '/packaging/14.png',
      cxRatio: 0.78,
      cyRatio: 0.26,
      maxWRatio: 0.36,
      maxHRatio: 0.36,
      rotation: 18
    },
   
  ],
  'gift-box': [
    {
      src: '/packaging/GIFT BOX.png',
      cxRatio: 0.21,
      cyRatio: 0.55,
      maxWRatio: 0.46,
      maxHRatio: 0.72,
      rotation: 20
    },
    {
      src: '/packaging/10.png',
      cxRatio: 0.54,
      cyRatio: 0.49,
      maxWRatio: 0.26,
      maxHRatio: 0.35,
      rotation: -15
    },
    {
      src: '/packaging/14.png',
      cxRatio: 0.78,
      cyRatio: 0.26,
      maxWRatio: 0.36,
      maxHRatio: 0.36,
      rotation: 18
    }
  ],
  'diy-box': [
    {
      src: '/packaging/D.I.Y BOX.png',
      cxRatio: 0.21,
      cyRatio: 0.15,
      maxWRatio: 0.56,
      maxHRatio: 0.72,
      rotation: -20
    },
    {
      src: '/packaging/1.png',
      cxRatio: 0.52,
      cyRatio: 0.15,
      maxWRatio: 0.26,
      maxHRatio: 0.35,
      rotation: 0
    },
    {
      src: '/packaging/6.png',
      cxRatio: 0.83,
      cyRatio: 0.15,
      maxWRatio: 0.28,
      maxHRatio: 0.36,
      rotation: 0
    },
    {
      src: '/packaging/14.png',
      cxRatio: 0.21,
      cyRatio: 0.50,
      maxWRatio: 0.33,
      maxHRatio: 0.36,
      rotation: 0
    },
    {
      src: '/packaging/9.png',
      cxRatio: 0.52,
      cyRatio: 0.50,
      maxWRatio: 0.26,
      maxHRatio: 0.35,
      rotation: 0
    },
    {
      src: '/packaging/10.png',
      cxRatio: 0.83,
      cyRatio: 0.50,
      maxWRatio: 0.33,
      maxHRatio: 0.36,
      rotation: 0
    },
    {
      src: '/packaging/8.png',
      cxRatio: 0.21,
      cyRatio: 0.75,
      maxWRatio: 0.27,
      maxHRatio: 0.36,
      rotation: 10
    },
    {
      src: '/packaging/7.png',
      cxRatio: 0.21,
      cyRatio: 0.90,
      maxWRatio: 0.26,
      maxHRatio: 0.35,
      rotation: 0
    }
  ]
};
