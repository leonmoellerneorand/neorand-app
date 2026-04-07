// src/__tests__/Badge.test.tsx
import { render, screen } from '@testing-library/react'
import { Badge, StatusBadge, SubscriptionBadge } from '@/components/ui/Badge'

describe('StatusBadge', () => {
  it('renders Funcionando in green for funcionando', () => {
    render(<StatusBadge status="funcionando" />)
    expect(screen.getByText('Funcionando')).toBeInTheDocument()
  })
  it('renders En Desarrollo for en desarrollo', () => {
    render(<StatusBadge status="en desarrollo" />)
    expect(screen.getByText('En Desarrollo')).toBeInTheDocument()
  })
  it('renders En Pruebas for en pruebas', () => {
    render(<StatusBadge status="en pruebas" />)
    expect(screen.getByText('En Pruebas')).toBeInTheDocument()
  })
})

describe('SubscriptionBadge', () => {
  it('renders Activa for activa', () => {
    render(<SubscriptionBadge status="activa" />)
    expect(screen.getByText('Activa')).toBeInTheDocument()
  })
  it('renders Pago Fallido for pago fallido', () => {
    render(<SubscriptionBadge status="pago fallido" />)
    expect(screen.getByText('Pago Fallido')).toBeInTheDocument()
  })
})
