import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: Request) {
  try {
    const { departmentId, departmentName, email, password } = await request.json();

    // Validate input
    if (!departmentId || !departmentName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if department ID already exists
    const existingDepartment = await User.findOne({ departmentId });
    if (existingDepartment) {
      return NextResponse.json(
        { message: 'Department ID already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      departmentId,
      departmentName,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'Department registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 