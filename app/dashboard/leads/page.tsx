import { LeadsTable } from "@/components/dashboard/leads-table"

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all your sales leads in one place.
        </p>
      </div>
      <LeadsTable />
    </div>
  )
}
