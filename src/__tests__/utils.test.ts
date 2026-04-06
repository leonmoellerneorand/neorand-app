// src/__tests__/utils.test.ts
import { cn, formatDate, formatCurrency, getGreeting, getStageIndex, isValidUUID } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('deduplicates tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('formatCurrency', () => {
  it('formats number as MXN', () => {
    expect(formatCurrency(1400)).toMatch('1,400')
  })
})

describe('formatDate', () => {
  it('formats ISO date to readable string', () => {
    const result = formatDate('2025-05-01')
    expect(result).toMatch('mayo')
    expect(result).toMatch('2025')
  })
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—')
  })
})

describe('getGreeting', () => {
  it('returns buenos días for hour 8', () => {
    expect(getGreeting(8)).toBe('Buenos días')
  })
  it('returns buenas tardes for hour 14', () => {
    expect(getGreeting(14)).toBe('Buenas tardes')
  })
  it('returns buenas noches for hour 21', () => {
    expect(getGreeting(21)).toBe('Buenas noches')
  })
})

describe('getStageIndex', () => {
  it('maps en desarrollo to 2', () => {
    expect(getStageIndex('en desarrollo')).toBe(2)
  })
  it('maps en pruebas to 3', () => {
    expect(getStageIndex('en pruebas')).toBe(3)
  })
  it('maps funcionando to 4', () => {
    expect(getStageIndex('funcionando')).toBe(4)
  })
  it('defaults to 1 for unknown', () => {
    expect(getStageIndex('en mantenimiento')).toBe(1)
  })
})

describe('isValidUUID', () => {
  it('returns true for valid UUID', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })
  it('returns false for invalid string', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false)
  })
})
