import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '../../../../lib/db';

// This should be stored securely in environment variables
const ADMIN_REGISTRATION_KEY = 'your-secure-admin-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adminId, username, email, password, role } = body;

    // Validate required fields
    if (!adminId || !username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate admin key
    if (adminId !== ADMIN_REGISTRATION_KEY) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin registration key' },
        { status: 401 }
      );
    }

    // Check if admin ID already exists
    const existingAdminId = db.prepare('SELECT adminId FROM admins WHERE adminId = ?').get(adminId);
    if (existingAdminId) {
      return NextResponse.json(
        { success: false, message: 'Admin ID already exists' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = db.prepare('SELECT username FROM admins WHERE username = ?').get(username);
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = db.prepare('SELECT email FROM admins WHERE email = ?').get(email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const stmt = db.prepare(`
      INSERT INTO admins (
        adminId, username, email, password, role
      ) VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      adminId,
      username,
      email.toLowerCase(),
      hashedPassword,
      role
    );

    return NextResponse.json({
      success: true,
      message: 'Admin registered successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create admin' },
      { status: 500 }
    );
  }
} 