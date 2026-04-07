// src/components/portal/ReportPDF.tsx
'use client'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'

export interface ReportData {
  month: string
  contactName: string
  company: string
  solutionName: string
  total: number
  success: number
  error: number
  info: number
  generatedDate: string
}

// Dynamically import the actual PDF component — never SSR'd
const DownloadReportButtonInner = dynamic(
  () => import('./ReportPDFInner').then(m => m.DownloadReportButtonInner),
  {
    ssr: false,
    loading: () => (
      <Button variant="secondary" size="sm" disabled>
        <Download size={13} />Descargar PDF
      </Button>
    ),
  }
)

export function DownloadReportButton({ data }: { data: ReportData }) {
  return <DownloadReportButtonInner data={data} />
}
