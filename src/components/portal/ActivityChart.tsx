// src/components/portal/ActivityChart.tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface ChartDataPoint {
  month: string
  total: number
  success: number
  error: number
}

export function ActivityChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.1)" />
        <XAxis dataKey="month" tick={{ fill: '#1e3a5f', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#1e3a5f', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#04070f', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, color: '#eff6ff' }}
          cursor={{ fill: 'rgba(59,130,246,0.05)' }}
        />
        <Bar dataKey="success" name="Exitosas" fill="#4ade80" radius={[3, 3, 0, 0]} />
        <Bar dataKey="error" name="Errores" fill="#f87171" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
