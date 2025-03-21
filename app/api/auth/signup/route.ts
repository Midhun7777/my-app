import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Department from '@/app/models/Department';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { departmentId, departmentName, email, password, sectionName } = await request.json();
    console.log('Signup attempt for department:', { departmentId, departmentName, email, sectionName });

    // Validate required fields
    if (!departmentId || !departmentName || !email || !password || !sectionName) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('Connected to database');

    // Check if department ID already exists
    const existingDepartment = await Department.findOne({ departmentId });
    console.log('Existing department check:', existingDepartment ? 'Found' : 'Not found');
    
    if (existingDepartment) {
      console.log('Department ID already exists');
      return NextResponse.json(
        { message: 'Department ID already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await Department.findOne({ email });
    console.log('Existing email check:', existingEmail ? 'Found' : 'Not found');
    
    if (existingEmail) {
      console.log('Email already exists');
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Create new department
    const department = await Department.create({
      departmentId,
      departmentName,
      email,
      password: hashedPassword,
      sectionName,
    });
    console.log('Department created successfully:', {
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      email: department.email,
      sectionName: department.sectionName
    });

    // Return department data (excluding password)
    return NextResponse.json({
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      email: department.email,
      sectionName: department.sectionName,
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 