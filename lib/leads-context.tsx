"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { Lead } from "./types"

interface LeadsContextType {
  leads: Lead[]
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined)

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])

  // FETCH LEADS FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data)
      })
      .catch((err) => console.log(err))
  }, [])

  const addLead = (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setLeads((prev) => [newLead, ...prev])
  }

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, ...updates, updatedAt: new Date() }
          : lead
      )
    )
  }

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id))
  }

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const context = useContext(LeadsContext)
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider")
  }
  return context
}