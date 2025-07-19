import { mockPrisma, sampleBids, sampleUsers, sampleCollections, resetMocks, createMockRequest } from '../utils/test-utils'
import { POST } from '@/app/api/bids/accept/route'

describe('/api/bids/accept', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('POST /api/bids/accept', () => {
    it('should accept a bid successfully', async () => {
      // Arrange
      const bidToAccept = {
        ...sampleBids[0],
        collection: {
          ...sampleCollections[0],
          stocks: 100
        }
      }
      
      mockPrisma.bid.findUnique.mockResolvedValue(bidToAccept)
      mockPrisma.bid.update.mockResolvedValue({ ...bidToAccept, status: 'accepted' })
      mockPrisma.bid.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.collection.update.mockResolvedValue({ ...sampleCollections[0], stocks: 99 })
      
      const request = createMockRequest('POST', '/api/bids/accept', { bidId: 1 })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
      expect(mockPrisma.bid.update).toHaveBeenCalled()
      expect(mockPrisma.bid.updateMany).toHaveBeenCalled()
      expect(mockPrisma.collection.update).toHaveBeenCalled()
    })

    it('should handle bid not found', async () => {
      // Arrange
      mockPrisma.bid.findUnique.mockResolvedValue(null)
      const request = createMockRequest('POST', '/api/bids/accept', { bidId: 999 })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Bid not found' })
    })

    it('should handle missing bid ID', async () => {
      // Arrange
      const request = createMockRequest('POST', '/api/bids/accept', {})

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'bidId is required' })
    })
  })
}) 