import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Reject a specific bid
export async function POST(req: NextRequest) {
  try {
    const { bidId } = await req.json();

    if (!bidId) {
      return NextResponse.json(
        { error: 'bidId is required' },
        { status: 400 }
      );
    }

    // Update the bid status to rejected
    await prisma.bid.update({
      where: { id: bidId },
      data: { status: 'rejected' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting bid:', error);
    return NextResponse.json(
      { error: 'Failed to reject bid' },
      { status: 500 }
    );
  }
} 