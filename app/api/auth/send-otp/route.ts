import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { otpStore } from '../../../lib/otpStore';

// Configure email transporter with secure settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: true,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP for', email, ':', otp); // For debugging

    // Store OTP with timestamp
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
    });

    // Log store contents for debugging
    console.log('Current OTP store contents:', Array.from(otpStore.entries()));

    // Send email with improved HTML template
    await transporter.sendMail({
      from: `"Asset Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Verification Code</h2>
          <p style="color: #374151; margin-bottom: 20px;">Your verification code is:</p>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">If you didn't request this code, please ignore this email.</p>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">This is an automated message, please do not reply.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        return NextResponse.json(
          { message: 'Email configuration error. Please check your credentials.' },
          { status: 500 }
        );
      }
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { message: 'Unable to connect to email server. Please try again later.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Failed to send OTP. Please try again later.' },
      { status: 500 }
    );
  }
} 