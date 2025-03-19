import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: Request) {
  try {
    const { departmentId, password } = await request.json();

    // Validate input
    if (!departmentId || !password) {
      return NextResponse.json(
        { message: 'Department ID and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find user by department ID
    const user = await User.findOne({ departmentId });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid department ID or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid department ID or password' },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          departmentId: user.departmentId,
          departmentName: user.departmentName,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 