import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Admin from '@/app/models/Admin';
import bcrypt from 'bcryptjs';

// This should be stored securely in environment variables
const ADMIN_REGISTRATION_KEY = 'your-secure-admin-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received admin signup request:', { 
      adminId: body.adminId,
      name: body.name,
      email: body.email 
    });

    const { adminId, name, email, password, adminKey } = body;

    // Validate required fields
    if (!adminId || !name || !email || !password || !adminKey) {
      console.log('Missing required fields');
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate admin key
    if (adminKey !== ADMIN_REGISTRATION_KEY) {
      console.log('Invalid admin key');
      return NextResponse.json(
        { message: 'Invalid admin registration key' },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      await connectDB();
      console.log('Connected to database successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if admin ID already exists
    const existingAdmin = await Admin.findOne({ adminId });
    console.log('Existing admin check:', existingAdmin ? 'Found' : 'Not found');
    
    if (existingAdmin) {
      console.log('Admin ID already exists');
      return NextResponse.json(
        { message: 'Admin ID already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await Admin.findOne({ email });
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

    // Create new admin
    try {
      const admin = await Admin.create({
        adminId,
        name,
        email,
        password: hashedPassword,
      });
      console.log('Admin created successfully:', {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email
      });

      // Return admin data (excluding password)
      return NextResponse.json({
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
      }, { status: 201 });
    } catch (createError) {
      console.error('Error creating admin:', createError);
      return NextResponse.json(
        { message: 'Failed to create admin account' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Admin signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 