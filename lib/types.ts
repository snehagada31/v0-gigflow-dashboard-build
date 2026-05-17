export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"

export type LeadSource = "website" | "referral" | "linkedin" | "cold-call" | "email" | "other"

export interface Lead {
  id: string
  name: string
  email: string
  company: string
  phone: string
  status: LeadStatus
  source: LeadSource
  value: number
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
}
