import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Department from '@/app/models/Department';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { departmentId, password } = await request.json();
    console.log('Login attempt for department ID:', departmentId);

    // Validate input
    if (!departmentId || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'Department ID and password are required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('Connected to database');

    // List all departments for debugging
    const allDepartments = await Department.find({}, { departmentId: 1, departmentName: 1, _id: 0 });
    console.log('All departments in database:', allDepartments);

    // Find department by ID
    const department = await Department.findOne({ departmentId });
    console.log('Department found:', department ? {
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      hasPassword: !!department.password
    } : 'No');
    
    if (!department) {
      console.log('Department not found');
      return NextResponse.json(
        { message: 'Invalid department ID or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Comparing passwords...');
    const isValid = await bcrypt.compare(password, department.password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { message: 'Invalid department ID or password' },
        { status: 401 }
      );
    }

    console.log('Login successful');
    // Return department data (excluding password)
    return NextResponse.json({
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      email: department.email,
      sectionName: department.sectionName,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 