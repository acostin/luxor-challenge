import { mockPrisma, sampleCollections, sampleUsers, resetMocks, createMockRequest } from '../utils/test-utils'
import { GET, POST, DELETE } from '@/app/api/collections/route'

describe('/api/collections', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('GET /api/collections', () => {
    it('should return collections with pagination', async () => {
      // Arrange
      const totalCount = 2
      mockPrisma.collection.count.mockResolvedValue(totalCount)
      mockPrisma.collection.findMany.mockResolvedValue(sampleCollections)
      
      const request = createMockRequest('GET', '/api/collections?page=1&limit=10')

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.collections).toHaveLength(2)
      expect(data.collections[0]).toHaveProperty('bidCount', 0)
      expect(data.collections[0]).toHaveProperty('bids', [])
      expect(data.collections[0]).toHaveProperty('owner')
      expect(data.pagination).toBeDefined()
      expect(mockPrisma.collection.count).toHaveBeenCalled()
      expect(mockPrisma.collection.findMany).toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.collection.count.mockRejectedValue(new Error('Database error'))
      const request = createMockRequest('GET', '/api/collections')

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch collections' })
    })
  })

  describe('POST /api/collections', () => {
    it('should create a new collection successfully', async () => {
      // Arrange
      const newCollection = {
        name: 'New Collection',
        description: 'New description',
        stocks: 100,
        price: 1000,
        ownerId: 1,
      }
      
      const createdCollection = {
        id: 3,
        ...newCollection,
        owner: sampleUsers[0],
      }
      
      mockPrisma.collection.create.mockResolvedValue(createdCollection)
      const request = createMockRequest('POST', '/api/collections', newCollection)

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(createdCollection)
      expect(mockPrisma.collection.create).toHaveBeenCalledWith({
        data: newCollection,
        include: { 
          owner: true,
          bids: { include: { user: true } }
        }
      })
    })
  })

  describe('DELETE /api/collections', () => {
    it('should delete a collection successfully', async () => {
      // Arrange
      mockPrisma.collection.delete.mockResolvedValue(sampleCollections[0])
      mockPrisma.bid.deleteMany.mockResolvedValue({ count: 0 })
      const request = createMockRequest('DELETE', '/api/collections', { id: 1 })

      // Act
      const response = await DELETE(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(mockPrisma.collection.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })
    })
  })
}) 