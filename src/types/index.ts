// src/types/index.ts

export interface Deal {
  id: string
  lead_id: string | null
  contact_id: string | null
  auth_user_id: string | null
  status: 'en desarrollo' | 'en pruebas' | 'funcionando' | 'en mantenimiento'
  solution_name: string | null
  solution_description: string | null
  subscription_status: 'activa' | 'pago fallido' | 'cancelada'
  subscription_amount: number
  one_time_amount: number
  payment_status: 'pending_payment' | 'active'
  next_payment_date: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  payment_method_last4: string | null
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  lead_id: string | null
  phone: string | null
  full_name: string
  email: string
  company: string | null
  created_at: string
}

export interface DealWithContact extends Deal {
  contacts: Contact
}

export interface ActivityLog {
  id: string
  deal_id: string
  message: string
  type: 'info' | 'success' | 'error'
  created_at: string
}

export interface ChatMessage {
  id: string
  deal_id: string
  sender: 'client' | 'admin'
  message: string
  created_at: string
}

export interface SolutionRequest {
  id: string
  deal_id: string
  solution_type: string
  description: string
  urgency: 'baja' | 'media' | 'alta'
  status: string
  created_at: string
}

export interface AdminDealRow extends Deal {
  contacts: Contact
}
