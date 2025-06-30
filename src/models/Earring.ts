import mongoose, { Schema, Document } from 'mongoose';
import { generateProductSlug, generateUniqueSlug } from '../utils/slugify';

// Define string literal types for earring properties
export const EarringType = {
  STUD: 'Stud',
  DROP: 'Drop',
  DANGLE: 'Dangle',
  HOOP: 'Hoop',
  HUGGIE: 'Huggie',
  CHANDELIER: 'Chandelier',
  CLUSTER: 'Cluster',
  CLIMBER: 'Climber',
  THREADER: 'Threader',
  JACKET: 'Jacket'
};

export const EarringBack = {
  PUSH_BACK: 'Push Back',
  SCREW_BACK: 'Screw Back',
  LEVER_BACK: 'Lever Back',
  FRENCH_WIRE: 'French Wire',
  CLIP_ON: 'Clip On',
  MAGNETIC: 'Magnetic',
  THREADER: 'Threader'
};

export const EarringMetal = {
  GOLD_14K: '14K Gold',
  GOLD_18K: '18K Gold',
  WHITE_GOLD: 'White Gold',
  ROSE_GOLD: 'Rose Gold',
  YELLOW_GOLD: 'Yellow Gold',
  PLATINUM: 'Platinum',
  STERLING_SILVER: 'Sterling Silver',
  TITANIUM: 'Titanium'
};

export const EarringStyle = {
  CLASSIC: 'Classic',
  MODERN: 'Modern',
  VINTAGE: 'Vintage',
  BOHEMIAN: 'Bohemian',
  MINIMALIST: 'Minimalist',
  STATEMENT: 'Statement',
  ROMANTIC: 'Romantic',
  EDGY: 'Edgy'
};

export const CertificateLab = {
  GIA: 'GIA',
  AGS: 'AGS',
  IGI: 'IGI',
  GCAL: 'GCAL',
  HRD: 'HRD',
  NONE: 'None'
};

export interface IEarring extends Document {
  sku: string;
  slug: string;
  productNumber: string;
  name: string;
  type: string;
  backType: string;
  metal: string;
  style: string;
  gemstones?: Array<{
    type: string;
    carat?: number;
    color?: string;
    clarity?: string;
  }>;
  length?: number; // in mm for drop/dangle earrings
  width?: number; // in mm
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

const EarringSchema = new Schema(
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
      enum: Object.values(EarringType), 
      required: true 
    },
    backType: { 
      type: String, 
      enum: Object.values(EarringBack), 
      required: true 
    },
    metal: { 
      type: String, 
      enum: Object.values(EarringMetal), 
      required: true 
    },
    style: { 
      type: String, 
      enum: Object.values(EarringStyle), 
      required: true 
    },
    gemstones: {
      type: [GemstoneSchema],
      default: []
    },
    length: { type: Number }, // in mm for drop/dangle earrings
    width: { type: Number }, // in mm
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
EarringSchema.pre('save', async function(next) {
  try {
    // Only generate slug if it doesn't exist or name has changed
    if (!this.slug || this.isModified('name') || this.isModified('type') || this.isModified('metal')) {
      // Find existing slugs to ensure uniqueness
      const existingSlugs = await mongoose.model('Earring').find({
        _id: { $ne: this._id },
        slug: { $exists: true }
      }).distinct('slug');
      
      // Generate unique slug based on earring properties
      const title = `${this.name} ${this.type} ${this.metal}`;
      const baseSlug = generateProductSlug(
        title,
        'earring',
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
EarringSchema.virtual('calculatedDiscountPercentage').get(function() {
  if (this.price && this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Pre-save hook to validate images
EarringSchema.pre('save', function(next) {
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
let EarringModel: mongoose.Model<IEarring> | null = null;

// Only create the model on the server side
if (typeof window === 'undefined') {
  EarringModel = mongoose.models.Earring || mongoose.model<IEarring>('Earring', EarringSchema);
}

export default EarringModel as mongoose.Model<IEarring>;
