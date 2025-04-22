import mongoose from 'mongoose';
import { RingEnums } from '../constants/ringEnums';

// Define an interface for the document structure
interface IEngagementRing {
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  price: number;
  size: number;
  metal: {
    karat: string;
    color: string;
    description?: string;
    finish_type: string;
    width_mm?: number;
    total_carat_weight?: number;
  };
  main_stone: {
    type: string;
    gemstone_type?: string;
    number_of_stones?: number;
    carat_weight?: number;
    shape?: string;
    color?: string;
    clarity?: string;
    hardness?: number;
  };
  side_stone?: {
    type: string;
    number_of_stones?: number;
    total_carat?: number;
    shape?: string;
    color?: string;
    clarity?: string;
  };
  media?: {
    images: string[];
    video?: string;
  };
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
}

const EngagementRingSchema = new mongoose.Schema<IEngagementRing>({
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
  main_stone: {
    type: {
      type: String,
      enum: RingEnums.MAIN_STONE_TYPES,
      required: true
    },
    gemstone_type: {
      type: String,
      enum: RingEnums.GEMSTONE_TYPES,
      required: function(this: IEngagementRing) {
        return this.main_stone?.type === 'Gemstone';
      }
    },
    number_of_stones: Number,
    carat_weight: Number,
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
    hardness: Number
  },
  side_stone: {
    type: {
      type: String,
      enum: RingEnums.SIDE_STONE_TYPES
    },
    number_of_stones: Number,
    total_carat: Number,
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
    }
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

const EngagementRing = mongoose.models.EngagementRing || mongoose.model<IEngagementRing>('EngagementRing', EngagementRingSchema);

export default EngagementRing;