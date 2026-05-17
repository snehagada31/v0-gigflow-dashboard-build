"use client"

import { useState, useMemo } from "react"
import { useLeads } from "@/lib/leads-context"
import { Lead, LeadStatus, LeadSource } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react"
import { AddLeadDialog } from "@/components/dashboard/add-lead-dialog"
import { EditLeadDialog } from "@/components/dashboard/edit-lead-dialog"
import { DeleteLeadDialog } from "@/components/dashboard/delete-lead-dialog"

const ITEMS_PER_PAGE = 10

const statusOptions: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

const sourceOptions: { value: LeadSource | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "cold-call", label: "Cold Call" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
]

type SortOrder = "latest" | "oldest"

export function LeadsTable() {
  const { leads, deleteLead } = useLeads()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest")
  const [currentPage, setCurrentPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter)
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      result = result.filter((lead) => lead.source === sourceFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      const comparison = b.createdAt.getTime() - a.createdAt.getTime()
      return sortOrder === "latest" ? comparison : -comparison
    })

    return result
  }, [leads, searchQuery, statusFilter, sourceFilter, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedLeads.length / ITEMS_PER_PAGE)
  const paginatedLeads = filteredAndSortedLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead)
    setEditDialogOpen(true)
  }

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedLead) {
      deleteLead(selectedLead.id)
      setDeleteDialogOpen(false)
      setSelectedLead(null)
    }
  }

  const getStatusBadge = (status: LeadStatus) => {
    const styles: Record<LeadStatus, string> = {
      new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      qualified: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      proposal: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      won: "bg-green-500/20 text-green-400 border-green-500/30",
      lost: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return (
      <Badge variant="outline" className={`capitalize ${styles[status]}`}>
        {status}
      </Badge>
    )
  }

  const getSourceBadge = (source: LeadSource) => {
    return (
      <Badge variant="outline" className="capitalize bg-secondary/50 text-muted-foreground border-border">
        {source.replace("-", " ")}
      </Badge>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sourceFilter])

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-foreground">Leads</CardTitle>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LeadStatus | "all")}>
                <SelectTrigger className="w-[140px] bg-input border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as LeadSource | "all")}>
                <SelectTrigger className="w-[140px] bg-input border-border text-foreground">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
                className="bg-input border-border text-foreground hover:bg-secondary"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === "latest" ? "Latest" : "Oldest"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground hidden md:table-cell">Company</TableHead>
                    <TableHead className="text-muted-foreground hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground hidden sm:table-cell">Source</TableHead>
                    <TableHead className="text-muted-foreground hidden xl:table-cell">Value</TableHead>
                    <TableHead className="text-muted-foreground hidden xl:table-cell">Created</TableHead>
                    <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        No leads found. Try adjusting your filters or add a new lead.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLeads.map((lead) => (
                      <TableRow key={lead.id} className="border-border hover:bg-secondary/30">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{lead.name}</p>
                            <p className="text-sm text-muted-foreground md:hidden">{lead.company}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground hidden md:table-cell">{lead.company}</TableCell>
                        <TableCell className="text-muted-foreground hidden lg:table-cell">{lead.email}</TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{getSourceBadge(lead.source)}</TableCell>
                        <TableCell className="font-medium text-foreground hidden xl:table-cell">
                          {formatCurrency(lead.value)}
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden xl:table-cell">
                          {formatDate(lead.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border">
                              <DropdownMenuItem onClick={() => handleEdit(lead)} className="cursor-pointer">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem
                                onClick={() => handleDelete(lead)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedLeads.length)} of{" "}
                {filteredAndSortedLeads.length} leads
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-input border-border"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "bg-input border-border"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-input border-border"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AddLeadDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditLeadDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        lead={selectedLead}
      />
      <DeleteLeadDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        leadName={selectedLead?.name || ""}
      />
    </>
  )
}
