import mongoose from 'mongoose';
import { RingEnums } from '../constants/ringEnums';

// Adding Eternity-specific enums
const ETERNITY_SUBCATEGORIES = ["Full Eternity", "Half Eternity"];

// Define interface for EternityRing document
interface IEternityRing {
  title: string;
  category: string;
  subcategory: string;
  style?: string[];
  type?: string[];
  SKU: string;
  price: number;
  size: number;
  metal: {
    karat?: string;
    color?: string;
    description?: string;
    finish_type?: string;
    width_mm?: number;
    total_carat_weight?: number;
  };
  stones: {
    type: string;
    gemstone_type?: string;
    number_of_stones?: number;
    total_carat_weight?: number;
    shape?: string;
    color?: string;
    clarity?: string;
    setting_type?: string;
  };
  stone_placement?: {
    pattern?: string;
    coverage_percentage?: number;
  };
  media?: {
    images: string[];
    video?: string;
  };
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EternityRingSchema = new mongoose.Schema<IEternityRing>({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: RingEnums.CATEGORIES,
    default: 'Eternity'
  },
  subcategory: {
    type: String,
    enum: ETERNITY_SUBCATEGORIES,
    required: true
  },
  style: {
    type: [String],
    enum: RingEnums.STYLES
  },
  type: {
    type: [String],
    enum: RingEnums.TYPES
  },
  SKU: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  metal: {
    karat: {
      type: String,
      enum: RingEnums.METAL_KARATS
    },
    color: {
      type: String,
      enum: RingEnums.METAL_COLORS
    },
    description: String,
    finish_type: {
      type: String,
      enum: RingEnums.FINISH_TYPES
    },
    width_mm: Number,
    total_carat_weight: Number
  },
  stones: {
    type: {
      type: String,
      enum: RingEnums.MAIN_STONE_TYPES,
      required: true
    },
    gemstone_type: {
      type: String,
      enum: RingEnums.GEMSTONE_TYPES,
      required: function(this: IEternityRing) {
        return this.stones?.type === 'Gemstone';
      }
    },
    number_of_stones: Number,
    total_carat_weight: Number,
    shape: {
      type: String,
      enum: RingEnums.STONE_SHAPES
    },
    color: {
      type: String,
      enum: RingEnums.STONE_COLORS
    },
    clarity: {
      type: String,
      enum: RingEnums.STONE_CLARITIES
    },
    setting_type: {
      type: String,
      enum: ['Channel', 'Pavé', 'Prong', 'Bezel', 'Bar']
    }
  },
  stone_placement: {
    pattern: {
      type: String,
      enum: ['Continuous', 'Alternating', 'Graduated']
    },
    coverage_percentage: Number
  },
  media: {
    images: [String],
    video: String
  },
  description: String,
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

const EternityRing = mongoose.models.EternityRing || mongoose.model<IEternityRing>('EternityRing', EternityRingSchema);

export default EternityRing;