import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const asset = db.prepare('SELECT * FROM assets WHERE assetId = ?').get(params.id);
    
    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      assetName,
      assetType,
      assignedTo,
      status,
      location,
      purchaseDate,
      lastMaintenance,
      nextMaintenance,
      condition,
      notes,
      employeeName,
      employeeId,
      section,
      employeeLevel,
      idDocument
    } = body;

    // Validate required fields
    if (!assetName || !assetType || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Additional validation for employee type assets
    if (assetType === 'Employee') {
      if (!employeeName || !employeeId || !section || !employeeLevel) {
        return NextResponse.json(
          { success: false, message: 'Missing required employee fields' },
          { status: 400 }
        );
      }
    }

    // Check if asset exists
    const existingAsset = db.prepare('SELECT assetId FROM assets WHERE assetId = ?').get(params.id);
    if (!existingAsset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      );
    }

    // Update asset
    const stmt = db.prepare(`
      UPDATE assets SET
        assetName = ?,
        assetType = ?,
        assignedTo = ?,
        status = ?,
        location = ?,
        purchaseDate = ?,
        lastMaintenance = ?,
        nextMaintenance = ?,
        condition = ?,
        notes = ?,
        employeeName = ?,
        employeeId = ?,
        section = ?,
        employeeLevel = ?,
        idDocument = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE assetId = ?
    `);

    stmt.run(
      assetName,
      assetType,
      assignedTo,
      status,
      location,
      purchaseDate,
      lastMaintenance,
      nextMaintenance,
      condition,
      notes,
      employeeName,
      employeeId,
      section,
      employeeLevel,
      idDocument,
      params.id
    );

    return NextResponse.json({
      success: true,
      message: 'Asset updated successfully'
    });

  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if asset exists
    const existingAsset = db.prepare('SELECT assetId FROM assets WHERE assetId = ?').get(params.id);
    if (!existingAsset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      );
    }

    // Delete asset
    db.prepare('DELETE FROM assets WHERE assetId = ?').run(params.id);

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete asset' },
      { status: 500 }
    );
  }
} 