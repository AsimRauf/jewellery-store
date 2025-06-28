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
  stone: StoneSchema,
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

// Updated Payment Info Schema for Stripe
const PaymentInfoSchema = new Schema({
  paymentMethod: { 
    type: String, 
    enum: ['stripe', 'paypal', 'bank_transfer'],
    default: 'stripe'
  },
  // Stripe-specific fields
  stripePaymentIntentId: String,
  stripePaymentMethodId: String,
  cardLastFour: String,
  cardBrand: String,
  cardExpMonth: Number,
  cardExpYear: Number,
  billingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String
  },
  // Legacy fields for backward compatibility
  cardHolder: String,
  cardType: String,
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
    unique: true
    // Remove required: true - let the pre-save hook handle it
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
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'disputed'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'succeeded', 'failed', 'requires_action', 'refunded'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  notes: String
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

// Generate order number before saving - FIXED VERSION
OrderSchema.pre('save', function(next) {
  // Only generate if this is a new document and orderNumber is not set
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp.slice(-6)}-${random}`;
    console.log('✅ Generated order number:', this.orderNumber);
  }
  next();
});

// Indexes for better query performance - REMOVE DUPLICATE
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'paymentInfo.stripePaymentIntentId': 1 });

import { Document } from 'mongoose';

interface IOrderItem {
  productId: string;
  productType: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size: number;
  metalOption: {
    karat: string;
    color: string;
  };
  customization: {
    isCustomized: boolean;
    customizationType?: 'setting-diamond' | 'setting-gemstone' | 'preset';
    settingId?: string;
    diamondId?: string;
    gemstoneId?: string;
    metalType?: string;
    size?: number;
    customizationDetails?: {
      stone: {
        type: string;
        carat: number;
        color: string;
        clarity: string;
        gemstoneType?: string;
        image?: string;
      };
      setting: {
        style?: string;
        metalType?: string;
        settingType?: string;
      };
    };
  };
}

interface IShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface IPaymentInfo {
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  cardLastFour?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  cardHolder?: string;
  cardType?: string;
  transactionId?: string;
}

interface IPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: 'standard' | 'express' | 'overnight';
}

interface IOrder extends Document {
  orderNumber: string;
  userId: string;
  customerEmail: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  pricing: IPricing;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;