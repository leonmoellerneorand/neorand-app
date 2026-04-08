import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia',
    })
  }
  return _stripe
}

// Keep named export for backward compatibility within the codebase
export const stripe = {
  get billingPortal() { return getStripe().billingPortal },
  get invoices() { return getStripe().invoices },
  get webhooks() { return getStripe().webhooks },
  get subscriptions() { return getStripe().subscriptions },
}
