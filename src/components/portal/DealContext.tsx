// src/components/portal/DealContext.tsx
'use client'
import { createContext, useContext } from 'react'
import type { DealWithContact } from '@/types'

const DealContext = createContext<DealWithContact | null>(null)

export function DealProvider({ deal, children }: { deal: DealWithContact; children: React.ReactNode }) {
  return <DealContext.Provider value={deal}>{children}</DealContext.Provider>
}

export function useDeal(): DealWithContact {
  const ctx = useContext(DealContext)
  if (!ctx) throw new Error('useDeal must be used within DealProvider')
  return ctx
}
