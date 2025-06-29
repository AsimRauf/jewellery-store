import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const order = await Order.findById(params.id).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Admin order fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch order' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const updateData = await request.json();
    
    // Validate allowed fields for update
    const allowedFields = [
      'status',
      'paymentStatus', 
      'trackingNumber',
      'estimatedDelivery',
      'notes'
    ];
    
    const filteredData: any = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'disputed'];
    const validPaymentStatuses = ['pending', 'succeeded', 'failed', 'requires_action', 'refunded'];
    
    if (filteredData.status && !validStatuses.includes(filteredData.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    
    if (filteredData.paymentStatus && !validPaymentStatuses.includes(filteredData.paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status value' }, { status: 400 });
    }

    // Convert estimatedDelivery to Date if provided
    if (filteredData.estimatedDelivery) {
      filteredData.estimatedDelivery = new Date(filteredData.estimatedDelivery);
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: filteredData },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`✅ Order ${order.orderNumber} updated by admin`, filteredData);

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update order' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const order = await Order.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`🗑️ Order ${order.orderNumber} deleted by admin`);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Admin order delete error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete order' 
    }, { status: 500 });
  }
}
