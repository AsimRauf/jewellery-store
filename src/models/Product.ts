import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['ring', 'gemstone'], required: true },
  basePrice: { type: Number, required: true },
  description: { type: String, required: true },
  specifications: {
    sizes: [{
      value: { type: Number, required: true },
      additionalPrice: { type: Number, default: 0 }
    }],
    carats: [{
      value: { type: Number, required: true },
      additionalPrice: { type: Number, required: true }
    }],
    colors: [{
      name: { type: String, required: true },
      code: { type: String, required: true },
      additionalPrice: { type: Number, default: 0 }
    }],
    shapes: [{
      type: { type: String, enum: ['round', 'oval', 'rectangle', 'heart'], required: true },
      additionalPrice: { type: Number, default: 0 }
    }],
    materials: [{
      name: { type: String, required: true },
      purity: { type: String },
      additionalPrice: { type: Number, required: true }
    }]
  },
  variants: [{
    size: { type: Number, required: true },
    carat: { type: Number, required: true },
    color: { type: String, required: true },
    shape: { type: String, required: true },
    material: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);