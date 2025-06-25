import mongoose, { Schema } from 'mongoose';

// Clear existing model if it exists to force refresh
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

// Define stone schema to match your data structure
const StoneSchema = new Schema({
  type: { type: String, required: true },
  carat: { type: Number, required: true },
  color: { type: String, required: true },
  clarity: { type: String, required: true },
  gemstoneType: { type: String },
  image: { type: String }
}, { _id: false, strict: false });

// Customization Details Schema
const CustomizationDetailsSchema = new Schema({
  stone: StoneSchema, // Direct reference to StoneSchema
  setting: {
    style: String,
    metalType: String,
    settingType: String
  }
}, { _id: false });

// Customization Schema
const CustomizationSchema = new Schema({
  isCustomized: Boolean,
  customizationType: {
    type: String,
    enum: ['setting-diamond', 'setting-gemstone', 'preset']
  },
  settingId: String,
  diamondId: String,
  gemstoneId: String,
  metalType: String,
  size: Number,
  customizationDetails: CustomizationDetailsSchema
});

// Order Item Schema
const OrderItemSchema = new Schema({
  productId: String,
  productType: String,
  title: String,
  image: String,
  price: Number,
  quantity: Number,
  size: Number,
  metalOption: {
    karat: String,
    color: String
  },
  customization: CustomizationSchema
});

// Shipping Address Schema
const ShippingAddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' }
}, { _id: false });

// Payment Info Schema (secure)
const PaymentInfoSchema = new Schema({
  cardHolder: { type: String, required: true },
  cardLastFour: { type: String, required: true, maxlength: 4 },
  cardType: String,
  paymentMethod: { 
    type: String, 
    enum: ['card', 'paypal', 'bank_transfer'],
    default: 'card'
  },
  transactionId: String
}, { _id: false });

// Pricing Schema
const PricingSchema = new Schema({
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  shippingMethod: { 
    type: String, 
    enum: ['standard', 'express', 'overnight'],
    required: true 
  }
}, { _id: false });

// Main Order Schema
const OrderSchema = new Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  customerEmail: { 
    type: String, 
    required: true
  },
  items: [OrderItemSchema],
  shippingAddress: { type: ShippingAddressSchema, required: true },
  paymentInfo: { type: PaymentInfoSchema, required: true },
  pricing: { type: PricingSchema, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  notes: String
}, {
  timestamps: true
});

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp.slice(-6)}-${random}`;
  }
  next();
});

// Indexes for better query performance
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

import { Document } from 'mongoose';

interface IOrder extends Document {
  orderNumber: string;
  userId: string;
  customerEmail: string;
  items: any[];
  shippingAddress: any;
  paymentInfo: any;
  pricing: any;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;