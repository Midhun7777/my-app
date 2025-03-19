import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Asset from '@/app/models/Asset';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id } = params;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();

    const asset = await Asset.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!asset) {
      return NextResponse.json(
        { message: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Asset status updated successfully', asset },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating asset status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 