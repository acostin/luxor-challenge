import { mockPrisma, sampleUsers, resetMocks, createMockRequest } from '../utils/test-utils'
import { GET } from '@/app/api/users/route'

describe('/api/users', () => {
  beforeEach(() => {
    resetMocks()
  })

  describe('GET /api/users', () => {
    it('should return all users successfully', async () => {
      // Arrange
      mockPrisma.user.findMany.mockResolvedValue(sampleUsers)
      const request = createMockRequest('GET', '/api/users')

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toEqual(sampleUsers)
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' }
      })
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database connection failed'))
      const request = createMockRequest('GET', '/api/users')

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch users' })
    })
  })
}) 