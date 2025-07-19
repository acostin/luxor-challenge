import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List bids with pagination and filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get('collection_id');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const skip = (page - 1) * limit;
  const where = collectionId ? { collectionId: Number(collectionId) } : {};

  try {
    // Get total count for pagination
    const total = await prisma.bid.count({ where });
    
    // Get paginated bids
    const bids = await prisma.bid.findMany({
      skip,
      take: limit,
      where,
      include: {
        user: true,
        collection: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: {
        price: 'desc', // Sort by price highest to lowest
      },
    });

    return NextResponse.json({
      bids,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bids' },
      { status: 500 }
    );
  }
}

// POST: Create a new bid
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const bid = await prisma.bid.create({
      data: {
        ...data,
        status: data.status || 'pending', // Default to pending if not provided
      },
      include: {
        user: true,
        collection: {
          include: {
            owner: true,
          },
        },
      },
    });
    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json(
      { error: 'Failed to create bid' },
      { status: 500 }
    );
  }
}

// PUT: Update a bid
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...update } = data;
    const bid = await prisma.bid.update({
      where: { id: parseInt(id) },
      data: update,
      include: {
        user: true,
        collection: {
          include: {
            owner: true,
          },
        },
      },
    });
    return NextResponse.json(bid);
  } catch (error) {
    console.error('Error updating bid:', error);
    return NextResponse.json(
      { error: 'Failed to update bid' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a bid
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.bid.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bid:', error);
    return NextResponse.json(
      { error: 'Failed to delete bid' },
      { status: 500 }
    );
  }
} 