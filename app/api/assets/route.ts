import { NextResponse } from 'next/server';
import db from '../../lib/db';

export async function GET() {
  try {
    const assets = db.prepare('SELECT * FROM assets ORDER BY createdAt DESC').all();
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      assetId,
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
    if (!assetId || !assetName || !assetType || !status) {
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

    // Check if asset ID already exists
    const existingAsset = db.prepare('SELECT assetId FROM assets WHERE assetId = ?').get(assetId);
    if (existingAsset) {
      return NextResponse.json(
        { success: false, message: 'Asset ID already exists' },
        { status: 400 }
      );
    }

    // Insert new asset
    const stmt = db.prepare(`
      INSERT INTO assets (
        assetId, assetName, assetType, assignedTo,
        status, location, purchaseDate, lastMaintenance,
        nextMaintenance, condition, notes,
        employeeName, employeeId, section, employeeLevel, idDocument
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      assetId,
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
    );

    return NextResponse.json({
      success: true,
      message: 'Asset created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create asset' },
      { status: 500 }
    );
  }
} 