import mongoose, { Schema, Document } from 'mongoose';

// Define enums for consistent values
export enum DiamondType {
  NATURAL = 'natural',
  LAB = 'lab'
}

export enum DiamondShape {
  ROUND = 'round',
  PRINCESS = 'princess',
  CUSHION = 'cushion',
  EMERALD = 'emerald',
  OVAL = 'oval',
  RADIANT = 'radiant',
  PEAR = 'pear',
  HEART = 'heart',
  MARQUISE = 'marquise',
  ASSCHER = 'asscher'
}

export enum DiamondColor {
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M'
}

export enum DiamondClarity {
  FL = 'FL',
  IF = 'IF',
  VVS1 = 'VVS1',
  VVS2 = 'VVS2',
  VS1 = 'VS1',
  VS2 = 'VS2',
  SI1 = 'SI1',
  SI2 = 'SI2',
  I1 = 'I1',
  I2 = 'I2',
  I3 = 'I3'
}

export enum DiamondCut {
  EXCELLENT = 'Excellent',
  VERY_GOOD = 'Very Good',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum DiamondPolish {
  EXCELLENT = 'Excellent',
  VERY_GOOD = 'Very Good',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum DiamondSymmetry {
  EXCELLENT = 'Excellent',
  VERY_GOOD = 'Very Good',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum DiamondFluorescence {
  NONE = 'None',
  FAINT = 'Faint',
  MEDIUM = 'Medium',
  STRONG = 'Strong',
  VERY_STRONG = 'Very Strong',
  STG = 'STG' // As seen in your example
}

export enum CertificateLab {
  GIA = 'GIA',
  IGI = 'IGI',
  AGS = 'AGS',
  HRD = 'HRD',
  GCAL = 'GCAL'
}

// Add this enum for fancy colors
export enum DiamondFancyColor {
  YELLOW = 'Yellow',
  PINK = 'Pink',
  BLUE = 'Blue',
  GREEN = 'Green',
  ORANGE = 'Orange',
  PURPLE = 'Purple',
  BROWN = 'Brown',
  BLACK = 'Black',
  RED = 'Red',
  GRAY = 'Gray'
}

export interface IDiamond extends Document {
  sku: string;
  productNumber: string;
  type: DiamondType;
  carat: number;
  shape: DiamondShape;
  color: DiamondColor | string; // Allow string for fancy colors
  fancyColor?: DiamondFancyColor | string;
  clarity: DiamondClarity;
  cut?: DiamondCut;
  polish?: DiamondPolish;
  symmetry?: DiamondSymmetry;
  fluorescence?: DiamondFluorescence;
  measurements: string;
  treatment?: string;
  certificateLab?: CertificateLab;
  crownAngle?: number;
  crownHeight?: number;
  pavilionAngle?: number;
  pavilionDepth?: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images?: Array<{ url: string; publicId: string }>;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Update the images schema definition to be a proper subdocument
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
}, { _id: false });  // Add this option to prevent Mongoose from adding _id to each image

const DiamondSchema: Schema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    productNumber: { type: String, required: true },
    type: { 
      type: String, 
      enum: Object.values(DiamondType), 
      required: true 
    },
    carat: { type: Number, required: true },
    shape: { 
      type: String, 
      enum: Object.values(DiamondShape), 
      required: true 
    },
    color: { type: String, required: true },
    fancyColor: { 
      type: String, 
      enum: Object.values(DiamondFancyColor),
      default: null
    },
    clarity: { 
      type: String, 
      enum: Object.values(DiamondClarity), 
      required: true 
    },
    cut: { 
      type: String, 
      enum: Object.values(DiamondCut) 
    },
    polish: { 
      type: String, 
      enum: Object.values(DiamondPolish) 
    },
    symmetry: { 
      type: String, 
      enum: Object.values(DiamondSymmetry) 
    },
    fluorescence: { 
      type: String, 
      enum: Object.values(DiamondFluorescence) 
    },
    measurements: { type: String, required: true },
    treatment: { type: String },
    certificateLab: { 
      type: String, 
      enum: Object.values(CertificateLab) 
    },
    crownAngle: { type: Number },
    crownHeight: { type: Number },
    pavilionAngle: { type: Number },
    pavilionDepth: { type: Number },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    discountPercentage: { type: Number },
    images: {
      type: [ImageSchema],
      default: [],
      validate: {
        validator: function(v: unknown) {
          if (!Array.isArray(v)) return false;
          return v.every(img => 
            img !== null && 
            typeof img === 'object' && 
            img && 
            'url' in img && 
            'publicId' in img && 
            typeof (img as { url: unknown }).url === 'string' && 
            typeof (img as { publicId: unknown }).publicId === 'string'
          );
        },
        message: 'Images must be an array of objects with url and publicId strings'
      }
    },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    strict: true // Ensure strict schema validation
  }
);

// Virtual for calculating discount percentage if not provided
DiamondSchema.virtual('calculatedDiscountPercentage').get(function(this: IDiamond) {
  if (this.price && this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Method to format price for display
DiamondSchema.methods.formatPrice = function() {
  return `$${this.price.toLocaleString()}`;
};

// Method to format sale price for display
DiamondSchema.methods.formatSalePrice = function() {
  return this.salePrice ? `$${this.salePrice.toLocaleString()}` : null;
};

// Update the pre-save middleware with better validation
DiamondSchema.pre('save', function(next) {
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

// Check if the model exists before creating it
const Diamond = mongoose.models.Diamond || mongoose.model<IDiamond>('Diamond', DiamondSchema);

export default Diamond;