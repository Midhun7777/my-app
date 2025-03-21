import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import OfficeAsset from '@/app/models/OfficeAsset';

export async function GET() {
  try {
    await connectDB();
    const assets = await OfficeAsset.find().sort({ createdAt: -1 });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { message: 'Error fetching assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['type', 'assetNumber', 'model', 'quantity', 'certificateUrl', 'location', 'department'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate asset type
    const validTypes = ['system', 'table', 'chair', 'employee'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { message: 'Invalid asset type' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (body.quantity < 1) {
      return NextResponse.json(
        { message: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Check if asset number already exists
    await connectDB();
    const existingAsset = await OfficeAsset.findOne({ assetNumber: body.assetNumber });
    if (existingAsset) {
      return NextResponse.json(
        { message: 'Asset number already exists' },
        { status: 400 }
      );
    }

    // Create new asset
    const asset = await OfficeAsset.create(body);
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { message: 'Error creating asset' },
      { status: 500 }
    );
  }
} 