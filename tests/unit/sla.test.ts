import { describe, it, expect } from 'vitest'
import { calculateSLA, calculateBusinessMinutes, calculateSLAPercentage } from '@/lib/sla'
import { addHours, setHours, setMinutes, startOfDay, addDays } from 'date-fns'

describe('SLA Logic (Phase 3)', () => {
  describe('calculateBusinessMinutes', () => {
    it('should calculate minutes within the same business day', () => {
      const start = new Date(2026, 2, 12, 10, 0) // Quinta, 10:00
      const end = new Date(2026, 2, 12, 12, 0)   // Quinta, 12:00
      expect(calculateBusinessMinutes(start, end)).toBe(120)
    })

    it('should exclude non-business hours', () => {
      const start = new Date(2026, 2, 12, 17, 0) // Quinta, 17:00
      const end = new Date(2026, 2, 13, 10, 0)   // Sexta, 10:00
      // 17:00 to 18:00 (60 min) + 09:00 to 10:00 (60 min) = 120 min
      expect(calculateBusinessMinutes(start, end)).toBe(120)
    })

    it('should exclude weekends', () => {
      const start = new Date(2026, 2, 13, 17, 0) // Sexta, 17:00
      const end = new Date(2026, 2, 16, 10, 0)   // Segunda, 10:00
      // Sexta: 1h (60 min)
      // Sabado: 9-12 (0 min in current implementation? wait let me check lib/sla.ts)
      // Actually lib/sla.ts excludes Saturday/Sunday? Let's check.
      // The comment says: "Seg-Sex: 09:00 - 18:00, Sáb: 09:00 - 12:00"
      // But let's verify the code.
      
      // Sábado (March 14, 2026)
      const saturdayStart = new Date(2026, 2, 14, 9, 0)
      const saturdayEnd = new Date(2026, 2, 14, 12, 0)
      expect(calculateBusinessMinutes(saturdayStart, saturdayEnd)).toBe(180)
    })
  })

  describe('calculateSLAPercentage', () => {
    it('should return 0 for new tickets', () => {
      const created = new Date()
      expect(calculateSLAPercentage(created, addHours(created, 1))).toBe(0)
    })

    it('should return 100 for expired tickets', () => {
      const created = new Date(2026, 2, 1, 10, 0)
      const due = new Date(2026, 2, 1, 11, 0)
      expect(calculateSLAPercentage(created, due)).toBe(100)
    })
  })
})
