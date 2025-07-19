import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Mock Prisma client for testing
export const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  collection: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  bid: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
}

// Mock the Prisma client at module level
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}))

// Helper to create mock request
export const createMockRequest = (method: string, url: string, body?: any): NextRequest => {
  // Convert relative URL to absolute URL for NextRequest
  const absoluteUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`
  
  const request = new NextRequest(absoluteUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (body) {
    // Mock the json method
    request.json = jest.fn().mockResolvedValue(body)
  }
  
  return request
}

// Helper to create mock response
export const createMockResponse = () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    headers: new Map(),
  }
  return res
}

// Sample test data
export const sampleUsers = [
  { id: 1, name: 'User 1', email: 'user1@test.com' },
  { id: 2, name: 'User 2', email: 'user2@test.com' },
]

export const sampleCollections = [
  {
    id: 1,
    name: 'Test Collection 1',
    description: 'Test description 1',
    stocks: 100,
    price: 1000,
    ownerId: 1,
    owner: sampleUsers[0],
    bids: [],
    _count: { bids: 0 },
  },
  {
    id: 2,
    name: 'Test Collection 2',
    description: 'Test description 2',
    stocks: 50,
    price: 500,
    ownerId: 2,
    owner: sampleUsers[1],
    bids: [],
    _count: { bids: 0 },
  },
]

export const sampleBids = [
  {
    id: 1,
    price: 1100,
    status: 'pending',
    userId: 2,
    collectionId: 1,
    user: sampleUsers[1],
    collection: sampleCollections[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    price: 1200,
    status: 'pending',
    userId: 1,
    collectionId: 2,
    user: sampleUsers[0],
    collection: sampleCollections[1],
    createdAt: new Date().toISOString(),
  },
]

// Reset all mocks before each test
export const resetMocks = () => {
  jest.clearAllMocks()
  Object.values(mockPrisma).forEach((mock) => {
    if (typeof mock === 'object' && mock !== null) {
      Object.values(mock).forEach((method) => {
        if (typeof method === 'function' && 'mockClear' in method) {
          method.mockClear()
        }
      })
    }
  })
} 