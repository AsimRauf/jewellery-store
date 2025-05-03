// Client-side type definitions for gemstones
export const GemstoneType = {
  RUBY: 'Ruby',
  EMERALD: 'Emerald',
  SAPPHIRE: 'Sapphire',
  AMETHYST: 'Amethyst',
  AQUAMARINE: 'Aquamarine',
  TOPAZ: 'Topaz',
  OPAL: 'Opal',
  GARNET: 'Garnet',
  PERIDOT: 'Peridot',
  TANZANITE: 'Tanzanite',
  TOURMALINE: 'Tourmaline',
  CITRINE: 'Citrine',
  MORGANITE: 'Morganite'
};

export const GemstoneSource = {
  NATURAL: 'natural',
  LAB: 'lab'
};

export const GemstoneShape = {
  ROUND: 'Round',
  PRINCESS: 'Princess',
  CUSHION: 'Cushion',
  EMERALD: 'Emerald',
  OVAL: 'Oval',
  RADIANT: 'Radiant',
  PEAR: 'Pear',
  HEART: 'Heart',
  MARQUISE: 'Marquise',
  ASSCHER: 'Asscher',
  TRILLION: 'Trillion',
  BAGUETTE: 'Baguette',
  CABOCHON: 'Cabochon'
};

export const GemstoneColor = {
  RED: 'Red',
  BLUE: 'Blue',
  GREEN: 'Green',
  YELLOW: 'Yellow',
  PURPLE: 'Purple',
  PINK: 'Pink',
  ORANGE: 'Orange',
  BROWN: 'Brown',
  BLACK: 'Black',
  WHITE: 'White',
  COLORLESS: 'Colorless',
  MULTI: 'Multi'
};

export const GemstoneClarity = {
  FL: 'FL', // Flawless
  IF: 'IF', // Internally Flawless
  VVS: 'VVS', // Very Very Slightly Included
  VS: 'VS', // Very Slightly Included
  SI: 'SI', // Slightly Included
  I: 'I', // Included
  OPAQUE: 'Opaque',
  TRANSLUCENT: 'Translucent',
  TRANSPARENT: 'Transparent'
};

export const GemstoneCut = {
  EXCELLENT: 'Excellent',
  VERY_GOOD: 'Very Good',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor'
};

export const GemstoneOrigin = {
  AFRICA: 'Africa',
  ASIA: 'Asia',
  AUSTRALIA: 'Australia',
  EUROPE: 'Europe',
  NORTH_AMERICA: 'North America',
  SOUTH_AMERICA: 'South America',
  BURMA: 'Burma',
  COLOMBIA: 'Colombia',
  BRAZIL: 'Brazil',
  SRI_LANKA: 'Sri Lanka',
  THAILAND: 'Thailand',
  INDIA: 'India',
  MADAGASCAR: 'Madagascar',
  ZAMBIA: 'Zambia',
  TANZANIA: 'Tanzania',
  RUSSIA: 'Russia',
  AFGHANISTAN: 'Afghanistan',
  MOZAMBIQUE: 'Mozambique'
};

export const GemstoneTreatment = {
  NONE: 'None',
  HEAT: 'Heat',
  IRRADIATION: 'Irradiation',
  FRACTURE_FILLING: 'Fracture Filling',
  DYEING: 'Dyeing',
  OILING: 'Oiling',
  WAXING: 'Waxing',
  BLEACHING: 'Bleaching',
  IMPREGNATION: 'Impregnation'
};

export const CertificateLab = {
  GIA: 'GIA',
  AGL: 'AGL',
  SSEF: 'SSEF',
  GUBELIN: 'Gubelin',
  GRS: 'GRS',
  IGI: 'IGI',
  AIGS: 'AIGS',
  GIT: 'GIT',
  NONE: 'None'
};

export interface GemstoneData {
  sku: string;
  productNumber: string;
  type: string;
  source: string;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  cut?: string;
  origin?: string;
  treatment?: string;
  measurements: string;
  certificateLab?: string;
  certificateNumber?: string;
  refractive_index?: number;
  hardness: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  description?: string;
}