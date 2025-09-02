export interface Gemstone {
  _id: string;
  slug?: string;
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
  video?: { url: string; publicId: string };
  isAvailable: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Gemstone Type Enums
export enum GemstoneType {
  RUBY = 'Ruby',
  EMERALD = 'Emerald',
  SAPPHIRE = 'Sapphire',
  AMETHYST = 'Amethyst',
  AQUAMARINE = 'Aquamarine',
  TOPAZ = 'Topaz',
  OPAL = 'Opal',
  GARNET = 'Garnet',
  PERIDOT = 'Peridot',
  TANZANITE = 'Tanzanite',
  TOURMALINE = 'Tourmaline',
  CITRINE = 'Citrine',
  MORGANITE = 'Morganite'
}

export enum GemstoneSource {
  NATURAL = 'Natural',
  LAB = 'Lab'
}

export enum GemstoneShape {
  ROUND = 'Round',
  PRINCESS = 'Princess',
  CUSHION = 'Cushion',
  EMERALD = 'Emerald',
  OVAL = 'Oval',
  RADIANT = 'Radiant',
  PEAR = 'Pear',
  HEART = 'Heart',
  MARQUISE = 'Marquise',
  ASSCHER = 'Asscher',
  TRILLION = 'Trillion',
  BAGUETTE = 'Baguette',
  CABOCHON = 'Cabochon'
}

export enum GemstoneColor {
  RED = 'Red',
  BLUE = 'Blue',
  GREEN = 'Green',
  YELLOW = 'Yellow',
  PURPLE = 'Purple',
  PINK = 'Pink',
  ORANGE = 'Orange',
  BROWN = 'Brown',
  BLACK = 'Black',
  WHITE = 'White',
  COLORLESS = 'Colorless',
  MULTI = 'Multi'
}

export enum GemstoneClarity {
  FL = 'FL', // Flawless
  IF = 'IF', // Internally Flawless
  VVS = 'VVS', // Very Very Slightly Included
  VS = 'VS', // Very Slightly Included
  SI = 'SI', // Slightly Included
  I = 'I', // Included
  OPAQUE = 'Opaque',
  TRANSLUCENT = 'Translucent',
  TRANSPARENT = 'Transparent'
}

export enum GemstoneCut {
  EXCELLENT = 'Excellent',
  VERY_GOOD = 'Very Good',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum GemstoneOrigin {
  AFRICA = 'Africa',
  ASIA = 'Asia',
  AUSTRALIA = 'Australia',
  EUROPE = 'Europe',
  NORTH_AMERICA = 'North America',
  SOUTH_AMERICA = 'South America',
  BURMA = 'Burma',
  COLOMBIA = 'Colombia',
  BRAZIL = 'Brazil',
  SRI_LANKA = 'Sri Lanka',
  THAILAND = 'Thailand',
  INDIA = 'India',
  MADAGASCAR = 'Madagascar',
  ZAMBIA = 'Zambia',
  TANZANIA = 'Tanzania',
  RUSSIA = 'Russia',
  AFGHANISTAN = 'Afghanistan',
  MOZAMBIQUE = 'Mozambique'
}

export enum GemstoneTreatment {
  NONE = 'None',
  NO_HEAT = 'No Heat',
  HEAT = 'Heat',
  IRRADIATION = 'Irradiation',
  FRACTURE_FILLING = 'Fracture Filling',
  DYEING = 'Dyeing',
  OILING = 'Oiling',
  WAXING = 'Waxing',
  BLEACHING = 'Bleaching',
  IMPREGNATION = 'Impregnation'
}

export enum GemstoneCertificateLab {
  GIA = 'GIA',
  AGL = 'AGL',
  SSEF = 'SSEF',
  GUBELIN = 'Gubelin',
  GRS = 'GRS',
  IGI = 'IGI',
  AIGS = 'AIGS',
  GIT = 'GIT',
  NONE = 'None'
}

// Filter interfaces
export interface GemstoneFilters {
  types: string[];
  shapes: string[];
  colors: string[];
  clarities: string[];
  cuts: string[];
  caratRange: [number, number] | null;
  priceRange: [number, number] | null;
  sources: string[];
  origins: string[];
  treatments: string[];
}

export interface AvailableGemstoneFilters {
  types: string[];
  shapes: string[];
  colors: string[];
  clarities: string[];
  cuts: string[];
  caratRanges: Array<[number, number]>;
  priceRanges: Array<[number, number]>;
  sources: string[];
  origins: string[];
  treatments: string[];
}

// API Response interfaces
export interface GemstoneListResponse {
  products: Gemstone[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface GemstoneDetailResponse {
  gemstone: Gemstone;
}

// Search and sort interfaces
export interface GemstoneSortOptions {
  'price-asc': string;
  'price-desc': string;
  'carat-asc': string;
  'carat-desc': string;
  'newest': string;
}

export interface GemstoneSearchParams {
  page?: string;
  limit?: string;
  types?: string;
  shapes?: string;
  colors?: string;
  clarities?: string;
  cuts?: string;
  sources?: string;
  origins?: string;
  treatments?: string;
  minCarat?: string;
  maxCarat?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

// Component prop interfaces
export interface GemstoneCardProps {
  gemstone: Gemstone;
  onClick: (gemstone: Gemstone) => void;
  onAddToCart?: (gemstone: Gemstone) => void;
  showAddToCart?: boolean;
}

export interface GemstoneGridProps {
  gemstones: Gemstone[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  onGemstoneClick: (gemstone: Gemstone) => void;
  onAddToCart?: (gemstone: Gemstone) => void;
  clearAllFilters: () => void;
}

export interface GemstoneFilterBarProps {
  filters: GemstoneFilters;
  availableFilters: AvailableGemstoneFilters;
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleType: (type: string) => void;
  toggleShape: (shape: string) => void;
  toggleColor: (color: string) => void;
  toggleClarity: (clarity: string) => void;
  toggleCut: (cut: string) => void;
  toggleSource: (source: string) => void;
  toggleOrigin: (origin: string) => void;
  toggleTreatment: (treatment: string) => void;
  setCaratRange: (range: [number, number] | null) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
}

export interface GemstoneMobileFiltersProps extends Omit<GemstoneFilterBarProps, 'activeFilterSection' | 'toggleFilterSection'> {
  closeFilters: () => void;
}

export interface GemstoneSortingOptionsProps {
  onSortChange: (option: string) => void;
  currentSort: string;
}

// Utility types
export type GemstoneCategory = 'all' | 'natural' | 'lab' | string;

export type GemstoneSortOption = 'price-asc' | 'price-desc' | 'carat-asc' | 'carat-desc' | 'newest';

// Constants
export const GEMSTONE_TYPES = Object.values(GemstoneType);
export const GEMSTONE_SOURCES = Object.values(GemstoneSource);
export const GEMSTONE_SHAPES = Object.values(GemstoneShape);
export const GEMSTONE_COLORS = Object.values(GemstoneColor);
export const GEMSTONE_CLARITIES = Object.values(GemstoneClarity);
export const GEMSTONE_CUTS = Object.values(GemstoneCut);
export const GEMSTONE_ORIGINS = Object.values(GemstoneOrigin);
export const GEMSTONE_TREATMENTS = Object.values(GemstoneTreatment);
export const GEMSTONE_CERTIFICATE_LABS = Object.values(GemstoneCertificateLab);

// Default filter ranges
export const DEFAULT_CARAT_RANGES: Array<[number, number]> = [
  [0.5, 1.0],
  [1.0, 2.0],
  [2.0, 3.0],
  [3.0, 5.0],
  [5.0, 10.0],
  [10.0, 20.0]
];

export const DEFAULT_PRICE_RANGES: Array<[number, number]> = [
  [100, 500],
  [500, 1000],
  [1000, 2500],
  [2500, 5000],
  [5000, 10000],
  [10000, 25000],
  [25000, 50000]
];

// Hardness scale for gemstones (Mohs scale)
export const GEMSTONE_HARDNESS: Record<string, number> = {
  [GemstoneType.RUBY]: 9,
  [GemstoneType.SAPPHIRE]: 9,
  [GemstoneType.EMERALD]: 7.5,
  [GemstoneType.AQUAMARINE]: 7.5,
  [GemstoneType.TOPAZ]: 8,
  [GemstoneType.AMETHYST]: 7,
  [GemstoneType.CITRINE]: 7,
  [GemstoneType.GARNET]: 7,
  [GemstoneType.PERIDOT]: 6.5,
  [GemstoneType.TANZANITE]: 6.5,
  [GemstoneType.TOURMALINE]: 7,
  [GemstoneType.MORGANITE]: 7.5,
  [GemstoneType.OPAL]: 5.5
};

// Refractive index ranges for gemstones
export const GEMSTONE_REFRACTIVE_INDEX: Record<string, [number, number]> = {
  [GemstoneType.RUBY]: [1.762, 1.770],
  [GemstoneType.SAPPHIRE]: [1.762, 1.770],
  [GemstoneType.EMERALD]: [1.565, 1.602],
  [GemstoneType.AQUAMARINE]: [1.567, 1.590],
  [GemstoneType.TOPAZ]: [1.606, 1.644],
  [GemstoneType.AMETHYST]: [1.544, 1.553],
  [GemstoneType.CITRINE]: [1.544, 1.553],
  [GemstoneType.GARNET]: [1.714, 1.888],
  [GemstoneType.PERIDOT]: [1.635, 1.690],
  [GemstoneType.TANZANITE]: [1.691, 1.700],
  [GemstoneType.TOURMALINE]: [1.614, 1.666],
  [GemstoneType.MORGANITE]: [1.567, 1.590],
  [GemstoneType.OPAL]: [1.370, 1.520]
};