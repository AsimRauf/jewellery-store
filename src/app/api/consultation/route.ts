import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Consultation from '@/models/Consultation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newConsultation = new Consultation({
      name,
      email,
      phone,
      message,
    });

    await newConsultation.save();

    return NextResponse.json({ message: 'Consultation request submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Consultation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}