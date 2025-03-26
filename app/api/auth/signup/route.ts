import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { createDepartment, findDepartmentById, findDepartmentByEmail, createDepartmentsTableSQL } from '../../../models/Department';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received signup request:', body);

    const { departmentId, departmentName, email, password, sectionName, employeeLevel } = body;

    // Validate required fields
    if (!departmentId || !departmentName || !email || !password || !sectionName || !employeeLevel) {
      console.log('Missing required fields:', { departmentId, departmentName, email, sectionName, employeeLevel });
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Check if department ID already exists
    const existingDepartmentId = await findDepartmentById(departmentId);
    console.log('Existing department check:', existingDepartmentId ? 'Found' : 'Not found');
    
    if (existingDepartmentId) {
      console.log('Department ID already exists');
      return NextResponse.json(
        { message: 'Department ID already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await findDepartmentByEmail(email);
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
    await createDepartment({
      departmentId,
      departmentName,
      email,
      password: hashedPassword,
      sectionName,
      employeeLevel,
    });
    console.log('Department created successfully');

    // Return department data (excluding password)
    const departmentData = {
      departmentId,
      departmentName,
      email,
      sectionName,
      employeeLevel,
    };

    return NextResponse.json(departmentData, { status: 201 });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { message: 'Error creating department' },
      { status: 500 }
    );
  }
} 