import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Accept a bid and reject others for the same collection
export async function POST(req: NextRequest) {
  try {
    const { bidId } = await req.json();

    if (!bidId) {
      return NextResponse.json(
        { error: 'bidId is required' },
        { status: 400 }
      );
    }

    // Get the bid to find the collection
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { collection: true }
    });

    if (!bid) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      );
    }

    // Check if collection has enough stock
    if (bid.collection.stocks <= 0) {
      return NextResponse.json(
        { error: 'Collection is out of stock' },
        { status: 400 }
      );
    }

    // Accept the selected bid
    await prisma.bid.update({
      where: { id: bidId },
      data: { status: 'accepted' },
    });

    // Reject all other bids for the collection
    await prisma.bid.updateMany({
      where: {
        collectionId: bid.collectionId,
        id: { not: bidId },
      },
      data: { status: 'rejected' },
    });

    // Decrease the collection stock
    await prisma.collection.update({
      where: { id: bid.collectionId },
      data: { stocks: bid.collection.stocks - 1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error accepting bid:', error);
    return NextResponse.json(
      { error: 'Failed to accept bid' },
      { status: 500 }
    );
  }
} 