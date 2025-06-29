import mongoose, { Schema } from 'mongoose';
import { RingEnums } from '../constants/ringEnums';
import { generateProductSlug, generateUniqueSlug } from '../utils/slugify';

// Define interface for Setting document
interface ISetting {
  title: string;
  slug: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  metalOptions: Array<{
    karat: string;
    color: string;
    price: number;
    description?: string;
    finish_type?: string | null;
    width_mm?: number;
    total_carat_weight?: number;
    isDefault: boolean;
  }>;
  metalColorImages: Map<string, Array<{
    url: string;
    publicId: string;
  }>>;
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  side_stone: {
    type: string;
    number_of_stones: number;
    total_carat: number;
    shape: string;
    color: string;
    clarity: string;
  };
  media: {
    images: Array<{
      url: string;
      publicId: string;
    }>;
    video: {
      url: string;
      publicId: string;
    };
  };
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  onSale?: boolean;
  originalPrice?: number;
  canAcceptStone: boolean; // New field to indicate if this setting can accept a stone
  compatibleStoneShapes: string[]; // New field to indicate which stone shapes are compatible
  settingHeight?: number; // Height of the setting in mm
  bandWidth?: number; // Width of the band in mm
}

// Define interface for Setting methods
interface ISettingMethods {
  getMetalPrice(karatValue: string, colorValue: string): number;
  getTotalPrice(karatValue: string, colorValue: string, sizeValue: number): number;
}

// Define interface for Setting model
type SettingModel = mongoose.Model<ISetting, object, ISettingMethods>;

const SettingSchema = new mongoose.Schema<ISetting, SettingModel, ISettingMethods>({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  category: {
    type: String,
    enum: RingEnums.CATEGORIES,
    default: 'Engagement'
  },
  style: {
    type: [String],
    enum: RingEnums.STYLES,
    default: [] // Allow empty array
  },
  type: {
    type: [String],
    enum: RingEnums.TYPES,
    default: [] // Allow empty array
  },
  SKU: {
    type: String,
    required: true,
    unique: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  metalOptions: {
    type: [{
      karat: {
        type: String,
        enum: RingEnums.METAL_KARATS,
        required: true
      },
      color: {
        type: String,
        enum: RingEnums.METAL_COLORS,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      description: String,
      finish_type: {
        type: Schema.Types.Mixed,
        validate: {
          validator: function(value: string | null | undefined) {
            // Allow empty string, null, undefined, or valid enum value
            return !value || value === '' || RingEnums.FINISH_TYPES.includes(value);
          },
          message: 'Invalid finish type'
        },
        default: null
      },
      width_mm: Number,
      total_carat_weight: Number,
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    required: true,
    validate: [arrayMinLength, 'At least one metal option must be available']
  },
  metalColorImages: {
    type: Object,  // Use Object instead of Map
    default: {}
  },
  sizes: {
    type: [{
      size: {
        type: Number,
        required: true,
        enum: RingEnums.SIZES.map(s => s.size)
      },
      isAvailable: {
        type: Boolean,
        default: true
      },
      additionalPrice: {
        type: Number,
        default: 0
      }
    }],
    required: true,
    validate: [arrayMinLength, 'At least one size must be available']
  },
  side_stone: {
    type: {
      type: String,
      enum: [...RingEnums.SIDE_STONE_TYPES, ''], // Allow empty string
      default: ''
    },
    number_of_stones: {
      type: Number,
      default: 0
    },
    total_carat: {
      type: Number,
      default: 0
    },
    shape: {
      type: String,
      enum: [...RingEnums.STONE_SHAPES, ''], // Allow empty string
      default: ''
    },
    color: {
      type: String,
      enum: [...RingEnums.STONE_COLORS, ''], // Allow empty string
      default: ''
    },
    clarity: {
      type: String,
      enum: [...RingEnums.STONE_CLARITIES, ''], // Allow empty string
      default: ''
    }
  },
  media: {
    images: {
      type: [{
        url: String,
        publicId: String
      }],
      default: []
    },
    video: {
      url: {
        type: String,
        default: ''
      },
      publicId: {
        type: String,
        default: ''
      }
    }
  },
  description: {
    type: String,
    default: ''
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isNew: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  originalPrice: {
    type: Number
  },
  canAcceptStone: {
    type: Boolean,
    default: true
  },
  compatibleStoneShapes: {
    type: [String],
    enum: RingEnums.STONE_SHAPES,
    default: []
  },
  settingHeight: {
    type: Number
  },
  bandWidth: {
    type: Number
  }
}, {
  timestamps: true
});

function arrayMinLength(val: unknown[]): boolean {
  return val.length > 0;
}

// Pre-save middleware to generate slug
SettingSchema.pre('save', async function(next) {
  try {
    // Only generate slug if it doesn't exist or title has changed
    if (!this.slug || this.isModified('title')) {
      // Find existing slugs to ensure uniqueness
      const existingSlugs = await mongoose.model('Setting').find({
        _id: { $ne: this._id },
        slug: { $exists: true }
      }).distinct('slug');
      
      // Generate unique slug
      const baseSlug = generateProductSlug(
        this.title,
        'ring-setting',
        undefined,
        this._id?.toString()
      );
      
      this.slug = generateUniqueSlug(baseSlug, existingSlugs);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

SettingSchema.virtual('productUrl').get(function(this: mongoose.HydratedDocument<ISetting>) {
  return `/products/rings/settings/${this.slug || this._id}`;
});

// Method to get the price for a specific metal option
SettingSchema.methods.getMetalPrice = function(karatValue: string, colorValue: string) {
  const selectedMetal = this.metalOptions.find(
    (m) => m.karat === karatValue && m.color === colorValue
  );
  
  return selectedMetal ? selectedMetal.price : this.basePrice;
};

// Method to calculate total price based on metal and size selection
SettingSchema.methods.getTotalPrice = function(karatValue: string, colorValue: string, sizeValue: number) {
  const metalPrice = this.getMetalPrice(karatValue, colorValue);
  
  if (!sizeValue) return metalPrice;
  
  const selectedSize = this.sizes.find((s) => s.size === sizeValue);
  if (!selectedSize) return metalPrice;
  
  return metalPrice + (selectedSize.additionalPrice || 0);
};

// Virtual to get the default metal option
SettingSchema.virtual('defaultMetal').get(function(this: mongoose.HydratedDocument<ISetting>) {
  return this.metalOptions.find((m) => m.isDefault) || this.metalOptions[0];
});

const Setting = mongoose.models.Setting || mongoose.model<ISetting, SettingModel>('Setting', SettingSchema);

export default Setting;