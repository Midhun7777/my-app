import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Asset from '@/app/models/Asset';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    if (!departmentId) {
      return NextResponse.json(
        { message: 'Department ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const assets = await Asset.find({ departmentId }).sort({ createdAt: -1 });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { departmentId, name, category, quantity } = await request.json();

    // Validate input
    if (!departmentId || !name || !category || !quantity) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create new asset
    const asset = await Asset.create({
      departmentId,
      name,
      category,
      quantity,
      status: 'pending',
    });

    return NextResponse.json(
      { message: 'Asset created successfully', asset },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 