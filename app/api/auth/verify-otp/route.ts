import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Department from '../../../models/Department';
import { otpStore } from '../../../lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    console.log('Verifying OTP for email:', email); // For debugging

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP
    const storedData = otpStore.get(email);
    console.log('Stored OTP data:', storedData); // For debugging
    console.log('Current OTP store contents:', Array.from(otpStore.entries())); // For debugging

    if (!storedData) {
      return NextResponse.json(
        { message: 'No OTP found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired (10 minutes)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      otpStore.delete(email);
      return NextResponse.json(
        { message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    otpStore.delete(email);
    console.log('OTP verified successfully for:', email);

    // Connect to database
    await connectDB();

    // Find department by email
    const department = await Department.findOne({ email });

    if (!department) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Return department data (excluding password)
    const departmentData = {
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      email: department.email,
      sectionName: department.sectionName,
    };

    return NextResponse.json(departmentData, { status: 200 });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
} 