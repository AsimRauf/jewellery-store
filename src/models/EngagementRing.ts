import mongoose, { Schema } from 'mongoose';
import { RingEnums } from '../constants/ringEnums';

// Define interface for EngagementRing document
interface IEngagementRing {
  title: string;
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
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  main_stone: {
    type: string;
    gemstone_type?: string;
    number_of_stones: number;
    carat_weight: number;
    shape: string;
    color: string;
    clarity: string;
    hardness: number;
  };
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
}

// Define interface for EngagementRing methods
interface IEngagementRingMethods {
  getMetalPrice(karatValue: string, colorValue: string): number;
  getTotalPrice(karatValue: string, colorValue: string, sizeValue: number): number;
}

// Define interface for EngagementRing model
type EngagementRingModel = mongoose.Model<IEngagementRing, object, IEngagementRingMethods>;

const EngagementRingSchema = new mongoose.Schema<IEngagementRing, EngagementRingModel, IEngagementRingMethods>({
  title: {
    type: String,
    required: true
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
  main_stone: {
    type: {
      type: String,
      enum: [...RingEnums.MAIN_STONE_TYPES, ''], // Allow empty string
      default: ''
    },
    gemstone_type: {
      type: String,
      enum: [...RingEnums.GEMSTONE_TYPES, ''], // Allow empty string
      default: '',
      required: function(this: IEngagementRing) {
        return this.main_stone?.type === 'Gemstone';
      }
    },
    number_of_stones: {
      type: Number,
      default: 0
    },
    carat_weight: {
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
    },
    hardness: {
      type: Number,
      default: 0
    }
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
  }
}, {
  timestamps: true
});

function arrayMinLength(val: unknown[]): boolean {
  return val.length > 0;
}

EngagementRingSchema.virtual('productUrl').get(function(this: mongoose.HydratedDocument<IEngagementRing>) {
  return `/products/rings/engagement/${this._id}`;
});

// Method to get the price for a specific metal option
EngagementRingSchema.methods.getMetalPrice = function(karatValue: string, colorValue: string) {
  const selectedMetal = this.metalOptions.find(
    (m) => m.karat === karatValue && m.color === colorValue
  );
  
  return selectedMetal ? selectedMetal.price : this.basePrice;
};

// Method to calculate total price based on metal and size selection
EngagementRingSchema.methods.getTotalPrice = function(karatValue: string, colorValue: string, sizeValue: number) {
  const metalPrice = this.getMetalPrice(karatValue, colorValue);
  
  if (!sizeValue) return metalPrice;
  
  const selectedSize = this.sizes.find((s) => s.size === sizeValue);
  if (!selectedSize) return metalPrice;
  
  return metalPrice + (selectedSize.additionalPrice || 0);
};

// Virtual to get the default metal option
EngagementRingSchema.virtual('defaultMetal').get(function(this: mongoose.HydratedDocument<IEngagementRing>) {
  return this.metalOptions.find((m) => m.isDefault) || this.metalOptions[0];
});

const EngagementRing = mongoose.models.EngagementRing || mongoose.model<IEngagementRing, EngagementRingModel>('EngagementRing', EngagementRingSchema);

export default EngagementRing;