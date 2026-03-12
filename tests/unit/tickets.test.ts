import { describe, it, expect } from 'vitest'

// Função de utilidade simulada (baseada na lógica da API)
function calculatePriority(impact: string, urgency: string): string {
  if (impact === "CRITICAL" || urgency === "CRITICAL") return "CRITICAL"
  if (impact === "HIGH" && urgency === "HIGH") return "HIGH"
  if (impact === "LOW" && urgency === "LOW") return "LOW"
  return "MEDIUM"
}

describe('Ticket Priority Logic (Phase 2)', () => {
  it('should return CRITICAL if impact or urgency is CRITICAL', () => {
    expect(calculatePriority('CRITICAL', 'LOW')).toBe('CRITICAL')
    expect(calculatePriority('LOW', 'CRITICAL')).toBe('CRITICAL')
  })

  it('should return HIGH only if both are HIGH', () => {
    expect(calculatePriority('HIGH', 'HIGH')).toBe('HIGH')
    expect(calculatePriority('HIGH', 'LOW')).toBe('MEDIUM')
  })

  it('should return LOW only if both are LOW', () => {
    expect(calculatePriority('LOW', 'LOW')).toBe('LOW')
    expect(calculatePriority('LOW', 'MEDIUM')).toBe('MEDIUM')
  })

  it('should default to MEDIUM', () => {
    expect(calculatePriority('MEDIUM', 'MEDIUM')).toBe('MEDIUM')
  })
})
