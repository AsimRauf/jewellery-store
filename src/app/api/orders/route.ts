import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db'; 
import Order from '@/models/Order';

// Add interface for order item structure
interface OrderItem {
  _id: string;
  productId?: string;
  productType: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size?: number;
  metalOption?: {
    karat: string;
    color: string;
  };
  customization?: {
    isCustomized: boolean;
    customizationType: 'setting-diamond' | 'setting-gemstone' | 'preset';
    customizationDetails?: {
      stone?: {
        type: string;
        carat: number;
        color: string;
        clarity: string;
        gemstoneType?: string;
        image?: string;
      };
      setting?: {
        style: string;
        metalType: string;
        settingType: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const orderData = await request.json();

    // Basic validation for required order data
    const requiredFields = ['items', 'shippingAddress', 'paymentInfo', 'pricing'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure customization details are properly structured
    orderData.items = orderData.items.map((item: OrderItem) => {
      if (item.customization?.customizationDetails?.stone) {
        return {
          ...item,
          customization: {
            ...item.customization,
            customizationDetails: {
              ...item.customization.customizationDetails,
              stone: {
                type: item.customization.customizationDetails.stone.type,
                carat: Number(item.customization.customizationDetails.stone.carat),
                color: item.customization.customizationDetails.stone.color,
                clarity: item.customization.customizationDetails.stone.clarity,
                gemstoneType: item.customization.customizationDetails.stone.gemstoneType,
                image: item.customization.customizationDetails.stone.image
              }
            }
          }
        };
      }
      return item;
    });

    // Create order with default status
    const order = new Order({
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    });

    const savedOrder = await order.save();

    return NextResponse.json({
      success: true,
      order: {
        _id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        status: savedOrder.status,
        total: savedOrder.pricing.total,
        estimatedDelivery: savedOrder.estimatedDelivery
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    const query = email ? { customerEmail: email } : 
                 orderNumber ? { orderNumber } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}