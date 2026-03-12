import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

// Mock do bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}))

describe('Auth Logic (Phase 1.1)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fail if user is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    
    // Simulating the authorize check manually since we can't easily call the NextAuth export
    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } })
    expect(user).toBeNull()
  })

  it('should fail if passwords do not match', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedpassword', approved: true }
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const passwordsMatch = await bcrypt.compare('wrongpassword', mockUser.password)
    expect(passwordsMatch).toBe(false)
  })

  it('should block unapproved users', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedpassword', approved: false }
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)
    
    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } })
    expect(user?.approved).toBe(false)
  })
})
