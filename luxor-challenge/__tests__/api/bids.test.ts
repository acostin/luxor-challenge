import { mockPrisma, sampleBids, sampleUsers, sampleCollections, resetMocks, createMockRequest } from '../utils/test-utils'
import { GET, POST, DELETE } from '@/app/api/bids/route'

describe('/api/bids', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('GET /api/bids', () => {
    it('should return all bids when no collection_id is provided', async () => {
      // Arrange
      mockPrisma.bid.findMany.mockResolvedValue(sampleBids)
      const request = createMockRequest('GET', '/api/bids')

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.bids).toEqual(sampleBids)
      expect(mockPrisma.bid.findMany).toHaveBeenCalled()
    })

    it('should return bids filtered by collection_id', async () => {
      // Arrange
      const collectionBids = sampleBids.filter(bid => bid.collectionId === 1)
      mockPrisma.bid.findMany.mockResolvedValue(collectionBids)
      const request = createMockRequest('GET', '/api/bids?collection_id=1')

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.bids).toEqual(collectionBids)
      expect(mockPrisma.bid.findMany).toHaveBeenCalledWith({
        where: { collectionId: 1 },
        include: {
          user: true,
          collection: { include: { owner: true } }
        },
        orderBy: { price: 'desc' },
        skip: 0,
        take: 10
      })
    })
  })

  describe('POST /api/bids', () => {
    it('should create a new bid successfully', async () => {
      // Arrange
      const newBid = {
        collectionId: 1,
        userId: 2,
        price: 1100,
      }
      
      const createdBid = {
        id: 3,
        ...newBid,
        status: 'pending',
        user: sampleUsers[1],
        collection: sampleCollections[0],
        createdAt: new Date().toISOString(),
      }
      
      mockPrisma.bid.create.mockResolvedValue(createdBid)
      const request = createMockRequest('POST', '/api/bids', newBid)

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(createdBid)
      expect(mockPrisma.bid.create).toHaveBeenCalledWith({
        data: {
          ...newBid,
          status: 'pending',
        },
        include: {
          user: true,
          collection: { include: { owner: true } }
        }
      })
    })
  })

  describe('DELETE /api/bids', () => {
    it('should delete a bid successfully', async () => {
      // Arrange
      mockPrisma.bid.delete.mockResolvedValue(sampleBids[0])
      const request = createMockRequest('DELETE', '/api/bids', { id: 1 })

      // Act
      const response = await DELETE(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(mockPrisma.bid.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })
    })
  })
}) 