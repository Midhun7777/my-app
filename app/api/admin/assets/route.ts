import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Asset from '@/app/models/Asset';

export async function GET(request: Request) {
  try {
    // In a real application, you would verify admin status here
    // For now, we'll just fetch all assets

    await connectDB();

    const assets = await Asset.find().sort({ createdAt: -1 });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 