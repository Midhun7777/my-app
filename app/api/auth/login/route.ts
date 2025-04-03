import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db';

interface Department {
  departmentId: string;
  departmentName: string;
  email: string;
  password: string;
  sectionName: string;
  employeeLevel: 'SC' | 'OS' | 'Head';
}

export async function POST(request: Request) {
  try {
    const { departmentId, password } = await request.json();

    if (!departmentId || !password) {
      return NextResponse.json(
        { message: 'Department ID and password are required' },
        { status: 400 }
      );
    }

    // Find department using SQLite with type assertion
    const department = db.prepare(
      'SELECT * FROM departments WHERE departmentId = ?'
    ).get(departmentId) as Department | undefined;

    if (!department) {
      return NextResponse.json(
        { message: 'Invalid department ID or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, department.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid department ID or password' },
        { status: 401 }
      );
    }

    // Return department data without sensitive information
    const departmentData = {
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      email: department.email,
      sectionName: department.sectionName,
      employeeLevel: department.employeeLevel
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