import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Asset from '@/app/models/Asset';
import OfficeAsset from '@/app/models/OfficeAsset';

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const asset = await OfficeAsset.findByIdAndDelete(params.id);
    
    if (!asset) {
      return NextResponse.json(
        { message: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Asset deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { message: 'Error deleting asset' },
      { status: 500 }
    );
  }
} 