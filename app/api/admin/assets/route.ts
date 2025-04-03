import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const assets = db.prepare(`
      SELECT a.*, d.departmentName, d.sectionName, d.employeeLevel
      FROM assets a
      LEFT JOIN departments d ON a.assignedTo = d.departmentId
      ORDER BY a.createdAt DESC
    `).all();
    
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
    console.log('Received asset data:', body);

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
      console.log('Missing required fields:', { assetId, assetName, assetType, status });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Additional validation for employee type assets
    if (assetType === 'Employee') {
      if (!employeeName || !employeeId || !section || !employeeLevel) {
        console.log('Missing required employee fields:', { employeeName, employeeId, section, employeeLevel });
        return NextResponse.json(
          { success: false, message: 'Missing required employee fields' },
          { status: 400 }
        );
      }
    }

    // Check if asset ID already exists
    const existingAsset = db.prepare('SELECT assetId FROM assets WHERE assetId = ?').get(assetId);
    if (existingAsset) {
      console.log('Asset ID already exists:', assetId);
      return NextResponse.json(
        { success: false, message: 'Asset ID already exists' },
        { status: 400 }
      );
    }

    // Check if assigned department exists
    if (assignedTo) {
      const department = db.prepare('SELECT departmentId FROM departments WHERE departmentId = ?').get(assignedTo);
      if (!department) {
        console.log('Assigned department not found:', assignedTo);
        return NextResponse.json(
          { success: false, message: 'Assigned department not found' },
          { status: 400 }
        );
      }
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

    try {
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
      console.log('Asset created successfully:', assetId);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database error while creating asset' },
        { status: 500 }
      );
    }

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