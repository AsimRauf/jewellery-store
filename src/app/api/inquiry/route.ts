import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, customer } = body;
    
    // Configure email transporter (you'll need to set up your SMTP details)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `Product Inquiry: ${product.title}`,
      html: `
        <h2>New Product Inquiry</h2>
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
        
        <h3>Product Information:</h3>
        <p><strong>Product:</strong> ${product.title}</p>
        <p><strong>SKU:</strong> ${product.sku}</p>
        <p><strong>Metal:</strong> ${product.metal}</p>
        <p><strong>Size:</strong> ${product.size}</p>
        <p><strong>Price:</strong> $${product.price.toLocaleString()}</p>
        
        <h3>Message:</h3>
        <p>${customer.message}</p>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending inquiry email:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry' },
      { status: 500 }
    );
  }
}