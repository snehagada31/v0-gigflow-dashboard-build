import { Lead, LeadStatus, LeadSource } from "./types"

const names = [
  "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "James Wilson",
  "Amanda Thompson", "David Kim", "Jessica Martinez", "Christopher Lee",
  "Ashley Brown", "Matthew Davis", "Jennifer Garcia", "Daniel Anderson",
  "Stephanie Taylor", "Andrew Thomas", "Nicole Jackson", "Joshua White",
  "Rachel Harris", "Brandon Martin", "Megan Robinson", "Tyler Clark"
]

const companies = [
  "TechCorp Solutions", "Global Innovations Inc", "Digital Dynamics",
  "Apex Systems", "CloudNine Technologies", "NextGen Software",
  "Quantum Enterprises", "Summit Industries", "Pioneer Labs",
  "Vertex Solutions", "Nova Digital", "Horizon Tech", "Stellar Systems",
  "Matrix Consulting", "Zenith Corp", "Eclipse Software", "Fusion Analytics",
  "Catalyst Group", "Momentum Partners", "Synergy Labs"
]

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"]
const sources: LeadSource[] = ["website", "referral", "linkedin", "cold-call", "email", "other"]

function generateMockLeads(count: number): Lead[] {
  const leads: Lead[] = []
  
  for (let i = 0; i < count; i++) {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90))
    
    const updatedAt = new Date(createdAt)
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 30))
    
    leads.push({
      id: `lead-${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)],
      email: `contact${i + 1}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(/\s+/g, '')}.com`,
      company: companies[Math.floor(Math.random() * companies.length)],
      phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      value: Math.floor(Math.random() * 95000) + 5000,
      notes: "",
      createdAt,
      updatedAt: updatedAt > new Date() ? new Date() : updatedAt
    })
  }
  
  return leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const mockLeads = generateMockLeads(50)
