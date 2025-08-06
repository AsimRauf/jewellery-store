import mongoose, { Schema, Document } from 'mongoose';
import { MetalOption } from '@/types/product';

export interface IProduct extends Document {
  name: string;
  slug: string;
  productType: string;
  price: number;
  images?: Array<{ url: string; publicId: string }>;
  metalOptions?: MetalOption[];
  media?: {
    images: Array<{
      url: string;
      publicId: string;
    }>;
  };
  title?: string;
  totalPieces?: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String },
  title: { type: String },
  slug: { type: String, unique: true, index: true },
  productType: { type: String, required: true },
  price: { type: Number, required: true },
  totalPieces: { type: Number, default: 0 },
  images: { type: Array },
  metalOptions: { type: Array },
  media: { type: Object },
}, {
  timestamps: true,
  strict: false, // Allow other fields
});

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;