import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Department from '../../../models/Department';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { departmentId, password } = await request.json();

    if (!departmentId || !password) {
      return NextResponse.json(
        { message: 'Department ID and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find department by departmentId
    const department = await Department.findOne({ departmentId });

    if (!department) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, department.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return department data (excluding password)
    const departmentData = {
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      email: department.email,
      sectionName: department.sectionName,
    };

    return NextResponse.json(departmentData);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 