import mongoose, { Schema, Document } from 'mongoose';
import { generateProductSlug, generateUniqueSlug } from '../utils/slugify';

// Define string literal types for men's jewelry properties
export const MensJewelryType = {
  RING: 'Ring',
  NECKLACE: 'Necklace',
  BRACELET: 'Bracelet',
  WATCH: 'Watch',
  CUFFLINKS: 'Cufflinks',
  TIE_CLIP: 'Tie Clip',
  CHAIN: 'Chain',
  PENDANT: 'Pendant',
  SIGNET_RING: 'Signet Ring',
  WEDDING_BAND: 'Wedding Band'
};

export const MensJewelryMetal = {
  GOLD_14K: '14K Gold',
  GOLD_18K: '18K Gold',
  WHITE_GOLD: 'White Gold',
  ROSE_GOLD: 'Rose Gold',
  YELLOW_GOLD: 'Yellow Gold',
  PLATINUM: 'Platinum',
  STERLING_SILVER: 'Sterling Silver',
  TITANIUM: 'Titanium',
  STAINLESS_STEEL: 'Stainless Steel',
  TUNGSTEN: 'Tungsten',
  PALLADIUM: 'Palladium'
};

export const MensJewelryStyle = {
  CLASSIC: 'Classic',
  MODERN: 'Modern',
  VINTAGE: 'Vintage',
  INDUSTRIAL: 'Industrial',
  MINIMALIST: 'Minimalist',
  BOLD: 'Bold',
  EXECUTIVE: 'Executive',
  CASUAL: 'Casual'
};

export const MensJewelryFinish = {
  POLISHED: 'Polished',
  MATTE: 'Matte',
  BRUSHED: 'Brushed',
  HAMMERED: 'Hammered',
  SANDBLASTED: 'Sandblasted',
  ANTIQUED: 'Antiqued'
};

import { CertificateLab } from '../constants/sharedEnums';

export interface IMensJewelry {
  sku: string;
  slug: string;
  productNumber: string;
  name: string;
  type: string;
  metal: string;
  style: string;
  finish: string;
  gemstones?: Array<{
    type: string;
    carat?: number;
    color?: string;
    clarity?: string;
  }>;
  // Size properties (varies by type)
  size?: string; // for rings
  length?: number; // for necklaces/chains (in inches)
  width?: number; // in mm
  thickness?: number; // in mm
  weight?: number; // in grams
  engraving?: {
    available: boolean;
    maxCharacters?: number;
    fonts?: string[];
  };
  certificateLab?: string;
  certificateNumber?: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  description?: string;
  features?: string[];
  care_instructions?: string;
  totalPieces?: number;
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

// Define the gemstone schema
const GemstoneSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  carat: {
    type: Number
  },
  color: {
    type: String
  },
  clarity: {
    type: String
  }
}, { _id: false });

// Define the engraving schema
const EngravingSchema = new Schema({
  available: {
    type: Boolean,
    default: false
  },
  maxCharacters: {
    type: Number,
    default: 20
  },
  fonts: {
    type: [String],
    default: ['Arial', 'Times New Roman', 'Script']
  }
}, { _id: false });

const MensJewelrySchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    slug: { 
      type: String, 
      unique: true, 
      index: true 
    },
    productNumber: { type: String, required: true },
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: Object.values(MensJewelryType), 
      required: true 
    },
    metal: { 
      type: String, 
      enum: Object.values(MensJewelryMetal), 
      required: true 
    },
    style: { 
      type: String, 
      enum: Object.values(MensJewelryStyle), 
      required: true 
    },
    finish: { 
      type: String, 
      enum: Object.values(MensJewelryFinish), 
      required: true 
    },
    gemstones: {
      type: [GemstoneSchema],
      default: []
    },
    size: { type: String }, // for rings
    length: { type: Number }, // for necklaces/chains (in inches)
    width: { type: Number }, // in mm
    thickness: { type: Number }, // in mm
    weight: { type: Number }, // in grams
    engraving: {
      type: EngravingSchema,
      default: () => ({ available: false })
    },
    certificateLab: { 
      type: String, 
      enum: Object.values(CertificateLab),
      default: CertificateLab.NONE
    },
    certificateNumber: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    discountPercentage: { type: Number },
    images: {
      type: [ImageSchema],
      default: []
    },
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
    features: { type: [String], default: [] },
    care_instructions: { type: String },
    totalPieces: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to generate slug
MensJewelrySchema.pre('save', async function(next) {
  try {
    // Only generate slug if it doesn't exist or name has changed
    if (!this.slug || this.isModified('name') || this.isModified('type') || this.isModified('metal')) {
      // Find existing slugs to ensure uniqueness
      const existingSlugs = await mongoose.model('MensJewelry').find({
        _id: { $ne: this._id },
        slug: { $exists: true }
      }).distinct('slug');
      
      // Generate unique slug based on men's jewelry properties
      const title = `${this.name} ${this.type} ${this.metal}`;
      const baseSlug = generateProductSlug(
        title,
        'mens-jewelry',
        this.metal,
        this._id?.toString()
      );
      
      this.slug = generateUniqueSlug(baseSlug, existingSlugs);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Virtual for calculating discount percentage if not provided
MensJewelrySchema.virtual('calculatedDiscountPercentage').get(function() {
  if (this.price && this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Pre-save hook to validate images
MensJewelrySchema.pre('save', function(next) {
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
let MensJewelryModel: mongoose.Model<IMensJewelry> | null = null;

// Only create the model on the server side
if (typeof window === 'undefined') {
  MensJewelryModel = mongoose.models.MensJewelry || mongoose.model<IMensJewelry>('MensJewelry', MensJewelrySchema);
}

export default MensJewelryModel as mongoose.Model<IMensJewelry>;
