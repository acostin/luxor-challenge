import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List collections with pagination and sorting
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const includeBids = searchParams.get('includeBids') === 'true';
  
  const skip = (page - 1) * limit;
  
  // Build sort object
  const orderBy: any = {};
  if (sortBy === 'owner') {
    orderBy.owner = { name: sortOrder };
  } else {
    orderBy[sortBy] = sortOrder;
  }

  try {
    // Get total count for pagination
    const total = await prisma.collection.count();
    
    // Get paginated collections
    const collections = await prisma.collection.findMany({
      skip,
      take: limit,
      orderBy,
      include: {
        owner: true,
        ...(includeBids && {
          bids: {
            include: {
              user: true,
            },
          },
        }),
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    // Transform the data to include bidCount
    const transformedCollections = collections.map((collection: any) => ({
      ...collection,
      bidCount: collection._count.bids,
      _count: undefined, // Remove the _count field
    }));

    return NextResponse.json({
      collections: transformedCollections,
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
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST: Create a new collection
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const collection = await prisma.collection.create({
      data,
      include: {
        owner: true,
        bids: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}

// PUT: Update a collection
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    // Get the existing collection to preserve ownerId
    const existingCollection = await prisma.collection.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }
    
    // Only allow updating these fields, preserve the original ownerId
    const updateFields: any = {
      name: updateData.name,
      description: updateData.description,
      stocks: updateData.stocks,
      price: updateData.price,
      ownerId: existingCollection.ownerId // Preserve original owner
    };
    
    const collection = await prisma.collection.update({
      where: { id: parseInt(id) },
      data: updateFields,
      include: {
        owner: true,
        bids: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a collection
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    // Delete related bids first to handle foreign key constraint
    await prisma.bid.deleteMany({
      where: { collectionId: parseInt(id) }
    });
    
    // Then delete the collection
    await prisma.collection.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
} 