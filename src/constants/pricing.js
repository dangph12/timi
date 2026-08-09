import { ITEM_TYPE_PACKAGING_IMAGES } from '@/constants/positions';

export const PACKAGING_OPTIONS = [
  {
    id: 'default-box',
    label: 'DEFAULT BOX',
    price: 0,
    imageSrc: '/packaging/DEFAULT BOX.png'
  },
  {
    id: 'gift-box',
    label: 'GIFT BOX',
    price: 130000,
    imageSrc: '/packaging/GIFT BOX.png'
  },
  {
    id: 'diy-box',
    label: 'DIY BOX',
    price: 50000,
    imageSrc: '/packaging/D.I.Y BOX.png'
  }
];

export const VERSION_OPTIONS = {
  standard: {
    label: 'STANDARD VERSION',
    price: 169000,
    imageSrc: '/version/standard.png'
  },
  economy: {
    label: 'ECONOMY VERSION',
    price: 139000,
    imageSrc: '/version/economy.png'
  }
};

export const INCLUDED_ITEM_OPTIONS = {
  keychain: {
    label: 'KEYCHAIN',
    price: 0,
    imageSrc: ITEM_TYPE_PACKAGING_IMAGES.keychain
  },
  magnet: {
    label: 'MAGNET',
    price: 0,
    imageSrc: ITEM_TYPE_PACKAGING_IMAGES.magnet
  },
  badges: {
    label: 'BADGES',
    price: 0,
    imageSrc: ITEM_TYPE_PACKAGING_IMAGES.badges
  },
  'luggage-tag': {
    label: 'LUGGAGE TAG',
    price: 0,
    imageSrc: ITEM_TYPE_PACKAGING_IMAGES['luggage-tag']
  }
};
