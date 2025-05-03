import mongoose, { Schema, Document } from 'mongoose';

// Define string literal types for gemstone properties
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

export interface IGemstone extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

// Define the image schema
const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  publicId: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const GemstoneSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    productNumber: { type: String, required: true },
    type: { 
      type: String, 
      enum: Object.values(GemstoneType), 
      required: true 
    },
    source: { 
      type: String, 
      enum: Object.values(GemstoneSource), 
      required: true,
      default: GemstoneSource.NATURAL
    },
    carat: { type: Number, required: true },
    shape: { 
      type: String, 
      enum: Object.values(GemstoneShape), 
      required: true 
    },
    color: { 
      type: String, 
      enum: Object.values(GemstoneColor), 
      required: true 
    },
    clarity: { 
      type: String, 
      enum: Object.values(GemstoneClarity), 
      required: true 
    },
    cut: { 
      type: String, 
      enum: Object.values(GemstoneCut) 
    },
    origin: { 
      type: String, 
      enum: Object.values(GemstoneOrigin) 
    },
    treatment: { 
      type: String, 
      enum: Object.values(GemstoneTreatment),
      default: GemstoneTreatment.NONE
    },
    measurements: { type: String, required: true },
    certificateLab: { 
      type: String, 
      enum: Object.values(CertificateLab),
      default: CertificateLab.NONE
    },
    certificateNumber: { type: String },
    refractive_index: { type: Number },
    hardness: { type: Number, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    discountPercentage: { type: Number },
    images: {
      type: [ImageSchema],
      default: []
    },
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
  },
  {
    timestamps: true
  }
);

// Virtual for calculating discount percentage if not provided
GemstoneSchema.virtual('calculatedDiscountPercentage').get(function() {
  if (this.price && this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Pre-save hook to validate images
GemstoneSchema.pre('save', function(next) {
  if (this.images) {
    if (!Array.isArray(this.images)) {
      return next(new Error('Images must be an array'));
    }
    
    // Validate each image object
    const invalidImage = this.images.find(img => !img.url || !img.publicId);
    if (invalidImage) {
      return next(new Error('Each image must have both url and publicId'));
    }
  }
  next();
});

// At the bottom of the file, replace the current export with:
let GemstoneModel: mongoose.Model<IGemstone> | null = null;

// Only create the model on the server side
if (typeof window === 'undefined') {
  GemstoneModel = mongoose.models.Gemstone || mongoose.model<IGemstone>('Gemstone', GemstoneSchema);
}

export default GemstoneModel as mongoose.Model<IGemstone>;