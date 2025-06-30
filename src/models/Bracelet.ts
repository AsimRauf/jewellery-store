import mongoose, { Schema, Document } from 'mongoose';
import { generateProductSlug, generateUniqueSlug } from '../utils/slugify';

// Define string literal types for bracelet properties
export const BraceletType = {
  TENNIS: 'Tennis',
  CHAIN: 'Chain',
  BANGLE: 'Bangle',
  CHARM: 'Charm',
  CUFF: 'Cuff',
  LINK: 'Link',
  BEADED: 'Beaded',
  WRAP: 'Wrap',
  TENNIS_DIAMOND: 'Tennis Diamond',
  PEARL: 'Pearl'
};

export const BraceletClosure = {
  LOBSTER_CLASP: 'Lobster Clasp',
  SPRING_RING: 'Spring Ring',
  TOGGLE: 'Toggle',
  MAGNETIC: 'Magnetic',
  HOOK_EYE: 'Hook & Eye',
  BOX_CLASP: 'Box Clasp',
  SLIDE: 'Slide',
  NONE: 'None' // for bangles/cuffs
};

export const BraceletMetal = {
  GOLD_14K: '14K Gold',
  GOLD_18K: '18K Gold',
  WHITE_GOLD: 'White Gold',
  ROSE_GOLD: 'Rose Gold',
  YELLOW_GOLD: 'Yellow Gold',
  PLATINUM: 'Platinum',
  STERLING_SILVER: 'Sterling Silver',
  TITANIUM: 'Titanium'
};

export const BraceletStyle = {
  CLASSIC: 'Classic',
  MODERN: 'Modern',
  VINTAGE: 'Vintage',
  BOHEMIAN: 'Bohemian',
  MINIMALIST: 'Minimalist',
  STATEMENT: 'Statement',
  ROMANTIC: 'Romantic',
  EDGY: 'Edgy'
};

import { CertificateLab } from '../constants/sharedEnums';

export interface IBracelet {
  sku: string;
  slug: string;
  productNumber: string;
  name: string;
  type: string;
  closure: string;
  metal: string;
  style: string;
  gemstones?: Array<{
    type: string;
    carat?: number;
    color?: string;
    clarity?: string;
  }>;
  length: number; // in inches
  width?: number; // in mm
  adjustable?: boolean;
  minLength?: number; // for adjustable bracelets
  maxLength?: number; // for adjustable bracelets
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

const BraceletSchema = new Schema(
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
      enum: Object.values(BraceletType), 
      required: true 
    },
    closure: { 
      type: String, 
      enum: Object.values(BraceletClosure), 
      required: true 
    },
    metal: { 
      type: String, 
      enum: Object.values(BraceletMetal), 
      required: true 
    },
    style: { 
      type: String, 
      enum: Object.values(BraceletStyle), 
      required: true 
    },
    gemstones: {
      type: [GemstoneSchema],
      default: []
    },
    length: { type: Number, required: true }, // in inches
    width: { type: Number }, // in mm
    adjustable: { type: Boolean, default: false },
    minLength: { type: Number }, // for adjustable bracelets
    maxLength: { type: Number }, // for adjustable bracelets
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
    care_instructions: { type: String }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to generate slug
BraceletSchema.pre('save', async function(next) {
  try {
    // Only generate slug if it doesn't exist or name has changed
    if (!this.slug || this.isModified('name') || this.isModified('type') || this.isModified('metal')) {
      // Find existing slugs to ensure uniqueness
      const existingSlugs = await mongoose.model('Bracelet').find({
        _id: { $ne: this._id },
        slug: { $exists: true }
      }).distinct('slug');
      
      // Generate unique slug based on bracelet properties
      const title = `${this.name} ${this.type} ${this.metal}`;
      const baseSlug = generateProductSlug(
        title,
        'bracelet',
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
BraceletSchema.virtual('calculatedDiscountPercentage').get(function() {
  if (this.price && this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Pre-save hook to validate images
BraceletSchema.pre('save', function(next) {
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
let BraceletModel: mongoose.Model<IBracelet> | null = null;

// Only create the model on the server side
if (typeof window === 'undefined') {
  BraceletModel = mongoose.models.Bracelet || mongoose.model<IBracelet>('Bracelet', BraceletSchema);
}

export default BraceletModel as mongoose.Model<IBracelet>;
