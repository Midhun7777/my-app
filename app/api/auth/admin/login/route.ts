import { NextResponse } from 'next/server';

// This should match the key in your .env file
const ADMIN_KEY = process.env.ADMIN_REGISTRATION_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminKey } = body;

    console.log('Admin login attempt');

    // Validate admin key
    if (!adminKey) {
      console.log('No admin key provided');
      return NextResponse.json(
        { message: 'Admin key is required' },
        { status: 400 }
      );
    }

    // Compare with the admin key from environment variables
    if (adminKey !== ADMIN_KEY) {
      console.log('Invalid admin key');
      return NextResponse.json(
        { message: 'Invalid admin key' },
        { status: 401 }
      );
    }

    console.log('Admin login successful');
    return NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 