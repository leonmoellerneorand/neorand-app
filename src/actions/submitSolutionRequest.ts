// src/actions/submitSolutionRequest.ts
// Middleware guarantees auth — dealId comes from server-rendered page (already validated)
'use server'
import { createServerClient } from '@/lib/supabase/server'

interface SolutionRequestInput {
  dealId: string
  solutionType: string
  description: string
  urgency: 'baja' | 'media' | 'alta'
}

export async function submitSolutionRequest(input: SolutionRequestInput) {
  const db = createServerClient()
  const { error } = await db.from('solution_requests').insert({
    deal_id: input.dealId,
    solution_type: input.solutionType,
    description: input.description,
    urgency: input.urgency,
  })

  if (error) throw new Error('Error al enviar la solicitud')
}
