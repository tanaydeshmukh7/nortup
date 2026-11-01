import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Mail,
  User,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  FileText,
  Layers,
  Inbox,
  CheckCircle2,
  Send,
  Trophy,
  XCircle,
} from 'lucide-react'
import { supabase } from '../../services/supabaseClient'
import {
  getAdminLeads,
  updateLeadStatus,
  getLeadNotes,
  addLeadNote,
  deleteLeadNote,
} from '../../services/adminService'

const PIPELINE_STATUSES = [
  { key: 'all', label: 'All Enquiries', color: 'text-white' },
  { key: 'new', label: 'New', color: 'text-[#FF8738]', bg: 'bg-[#FF4D0A]/15 border-[#FF4D0A]/30' },
  { key: 'contacted', label: 'Contacted', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  { key: 'qualified', label: 'Qualified', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  { key: 'won', label: 'Won', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  { key: 'lost', label: 'Lost', color: 'text-zinc-400', bg: 'bg-zinc-500/15 border-zinc-500/30' },
]

const SERVICES_LIST = [
  'All Services',
  'Website Design',
  'Web Development',
  'UI/UX Design',
  'Branding',
  'Other',
]

export default function AdminDashboard({ adminUser, onLogout, onNavigate }) {
  const [leads, setLeads] = useState([])
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    totalCount: 0,
    totalPages: 1,
  })

  // Filter & Search States
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedService, setSelectedService] = useState('All Services')
  const [sortOrder, setSortOrder] = useState('desc')

  // UI States
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null)
  const [copiedEmail, setCopiedEmail] = useState(null)

  // Lead Detail Drawer & Notes
  const [selectedLead, setSelectedLead] = useState(null)
  const [notes, setNotes] = useState([])
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  // Fetch leads from serverless API
  const loadLeads = useCallback(
    async (pageToLoad = 1) => {
      setErrorMessage(null)
      try {
        const data = await getAdminLeads({
          page: pageToLoad,
          pageSize: pagination.pageSize,
          search,
          status: selectedStatus,
          service: selectedService === 'All Services' ? 'all' : selectedService,
          sortOrder,
        })

        setLeads(data.leads || [])
        setMetrics(data.metrics || {})
        setPagination(data.pagination || { page: 1, pageSize: 15, totalCount: 0, totalPages: 1 })
      } catch (err) {
        setErrorMessage(err.message || 'Failed to fetch leads from server.')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [pagination.pageSize, search, selectedStatus, selectedService, sortOrder]
  )

  useEffect(() => {
    loadLeads(1)
  }, [selectedStatus, selectedService, sortOrder])

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadLeads(1)
  }

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    loadLeads(pagination.page)
  }

  // Handle Lead Status Change
  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingStatusId(leadId)
    try {
      const updatedLead = await updateLeadStatus(leadId, newStatus)
      // Update in table
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))
      // Update in open drawer
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }))
      }
      // Re-fetch metrics silently
      loadLeads(pagination.page)
      showNotification(`Status updated to ${newStatus}`)
    } catch (err) {
      alert(`Could not update status: ${err.message}`)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Open Lead Detail & fetch notes
  const openLeadDetail = async (lead) => {
    setSelectedLead(lead)
    setIsLoadingNotes(true)
    setNotes([])
    try {
      const leadNotes = await getLeadNotes(lead.id)
      setNotes(leadNotes)
    } catch (err) {
      console.warn('Could not load notes:', err.message)
    } finally {
      setIsLoadingNotes(false)
    }
  }

  // Add Internal Note
  const handleCreateNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim() || !selectedLead) return

    setIsAddingNote(true)
    try {
      const createdNote = await addLeadNote(selectedLead.id, newNote.trim())
      setNotes((prev) => [createdNote, ...prev])
      setNewNote('')
      showNotification('Internal note saved.')
    } catch (err) {
      alert(`Error saving note: ${err.message}`)
    } finally {
      setIsAddingNote(false)
    }
  }

  // Delete Note
  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this internal note?')) return
    try {
      await deleteLeadNote(noteId)
      setNotes((prev) => prev.filter((n) => n.id !== noteId))
      showNotification('Note removed.')
    } catch (err) {
      alert(`Error deleting note: ${err.message}`)
    }
  }

  const showNotification = (msg) => {
    setActionSuccessMessage(msg)
    setTimeout(() => setActionSuccessMessage(null), 3000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedEmail(text)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const getStatusBadge = (status) => {
    const s = PIPELINE_STATUSES.find((item) => item.key === status) || {
      label: status,
      color: 'text-white',
      bg: 'bg-white/10 border-white/20',
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border uppercase tracking-wider ${s.bg} ${s.color}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
        {s.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0908] text-[#F5F1ED] flex flex-col font-mono text-sm select-none">
      {/* 1. TOP ADMIN BAR */}
      <header className="sticky top-0 z-40 w-full bg-[#140F0D]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF4D0A]/15 border border-[#FF4D0A]/30 flex items-center justify-center text-[#FF8738]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-keania text-lg text-white tracking-wider uppercase">NORTHUP STUDIO</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FF4D0A]/20 border border-[#FF4D0A]/40 text-[#FF8738] text-[10px] font-bold tracking-widest uppercase">
                OPS CONSOLE
              </span>
            </div>
            <div className="text-[11px] text-white/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Admin: {adminUser?.email || 'admin@northupstudio.com'}</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh database records"
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/80 hover:text-white transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF8738]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/80 hover:text-white transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FF8738]" />
            <span className="hidden sm:inline">Public Site ↗</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      <AnimatePresence>
        {actionSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* 2. KPI METRICS CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total */}
          <div className="p-4 rounded-2xl bg-[#140F0D] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/50 text-[11px] uppercase tracking-wider mb-2">
              <span>Total Leads</span>
              <Layers className="w-4 h-4 text-[#FF8738]" />
            </div>
            <div className="font-jaro text-2xl sm:text-3xl text-white">{metrics.total}</div>
          </div>

          {/* New */}
          <div className="p-4 rounded-2xl bg-[#140F0D] border border-[#FF4D0A]/30 bg-gradient-to-br from-[#FF4D0A]/10 to-transparent flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#FF8738] text-[11px] uppercase tracking-wider mb-2">
              <span>New</span>
              <Inbox className="w-4 h-4 text-[#FF4D0A]" />
            </div>
            <div className="font-jaro text-2xl sm:text-3xl text-[#FF8738]">{metrics.new}</div>
          </div>

          {/* Contacted */}
          <div className="p-4 rounded-2xl bg-[#140F0D] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-400/80 text-[11px] uppercase tracking-wider mb-2">
              <span>Contacted</span>
              <Send className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-jaro text-2xl sm:text-3xl text-white">{metrics.contacted}</div>
          </div>

          {/* Qualified */}
          <div className="p-4 rounded-2xl bg-[#140F0D] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400/80 text-[11px] uppercase tracking-wider mb-2">
              <span>Qualified</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-jaro text-2xl sm:text-3xl text-white">{metrics.qualified}</div>
          </div>

          {/* Proposal Sent */}
          <div className="p-4 rounded-2xl bg-[#140F0D] border border-white/[0.08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-400/80 text-[11px] uppercase tracking-wider mb-2">
              <span>Proposals</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-jaro text-2xl sm:text-3xl text-white">{metrics.proposal_sent}</div>
          </div>

          {/* Won */}
          <div className="p-4 rounded-2xl bg-[#140F0D] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 text-[11px] uppercase tracking-wider mb-2">
              <span>Won Deals</span>
              <Trophy className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-jaro text-2xl sm:text-3xl text-emerald-400">{metrics.won}</div>
          </div>
        </section>

        {/* 3. PIPELINE STATUS TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
          {PIPELINE_STATUSES.map((tab) => {
            const isSelected = selectedStatus === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-[#140F0D] text-white/70 hover:text-white border border-white/[0.06] hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 4. SEARCH & FILTER CONTROLS */}
        <div className="p-4 rounded-2xl bg-[#140F0D] border border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1B1411] border border-white/[0.08] focus:border-[#FF4D0A] text-xs font-mono text-white placeholder-white/30 focus:outline-none transition-colors"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Service & Sort Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#1B1411] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[#FF4D0A] cursor-pointer"
            >
              {SERVICES_LIST.map((srv) => (
                <option key={srv} value={srv} className="bg-[#140F0D]">
                  {srv}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              title={`Sorting: ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
              className="px-3 py-2.5 rounded-xl bg-[#1B1411] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FF8738]" />
              <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Error Alert Banner if fetch fails */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#2A100B] border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error loading leads</p>
              <p className="mt-0.5 text-red-300/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 5. LEADS DATA TABLE */}
        <section className="rounded-2xl bg-[#140F0D] border border-white/[0.08] overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/60">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF4D0A]" />
              <span className="text-xs">Loading live enquiries from Supabase...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center px-4">
              <Inbox className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No enquiries found</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                No lead records matched your selected status, service filter, or search criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-white/50 font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Client / Company</th>
                    <th className="py-3.5 px-4">Service Required</th>
                    <th className="py-3.5 px-4">Budget &amp; Timeline</th>
                    <th className="py-3.5 px-4">Received</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {leads.map((lead) => {
                    const isUpdating = updatingStatusId === lead.id
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => openLeadDetail(lead)}
                      >
                        {/* Status Column */}
                        <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block">
                            <select
                              value={lead.status === 'closed_won' ? 'won' : lead.status === 'closed_lost' ? 'lost' : lead.status}
                              disabled={isUpdating}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="proposal_sent">Proposal Sent</option>
                              <option value="won">Won</option>
                              <option value="lost">Lost</option>
                            </select>
                            {getStatusBadge(lead.status)}
                          </div>
                        </td>

                        {/* Client Name & Email */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-white group-hover:text-[#FF8738] transition-colors">
                            {lead.name}
                          </div>
                          <div className="text-white/50 text-[11px] flex items-center gap-2 mt-0.5">
                            <span>{lead.email}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(lead.email)
                              }}
                              title="Copy email address"
                              className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity text-white/40 cursor-pointer"
                            >
                              {copiedEmail === lead.email ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {lead.company && (
                            <div className="text-[11px] text-[#A69E98] mt-0.5 font-medium flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-[#FF4D0A]" />
                              <span>{lead.company}</span>
                            </div>
                          )}
                        </td>

                        {/* Service Required */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/90 text-[11px]">
                            {lead.service}
                          </span>
                        </td>

                        {/* Budget & Timeline */}
                        <td className="py-4 px-4 whitespace-nowrap text-white/70">
                          <div>{lead.budget || 'Flexible'}</div>
                          <div className="text-[11px] text-white/40 mt-0.5">{lead.timeline || 'Flexible'}</div>
                        </td>

                        {/* Date Received */}
                        <td className="py-4 px-4 whitespace-nowrap text-white/50 text-[11px]">
                          {new Date(lead.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Action Details */}
                        <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => openLeadDetail(lead)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#FF4D0A] hover:text-white border border-white/[0.08] text-white/80 transition-all text-xs cursor-pointer"
                          >
                            Inspect Lead
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/60">
              <div>
                Showing page <span className="text-white font-bold">{pagination.page}</span> of{' '}
                <span className="text-white font-bold">{pagination.totalPages}</span> ({pagination.totalCount} total)
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => loadLeads(pagination.page - 1)}
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadLeads(pagination.page + 1)}
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 6. LEAD DETAIL & INTERNAL NOTES DRAWER */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xl bg-[#140F0D] border-l border-white/[0.12] h-full shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#1A1310]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(selectedLead.status)}
                    <span className="text-[11px] text-white/40">ID: {selectedLead.id.slice(0, 8)}...</span>
                  </div>
                  <h2 className="font-jaro text-2xl uppercase tracking-wider text-white">
                    {selectedLead.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Status Updater Card */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <label className="block text-[11px] uppercase tracking-wider text-white/50 mb-2">
                    Update Pipeline Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'].map((st) => {
                      const isActive = selectedLead.status === st || (st === 'won' && selectedLead.status === 'closed_won') || (st === 'lost' && selectedLead.status === 'closed_lost')
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(selectedLead.id, st)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-mono capitalize transition-all border cursor-pointer ${
                            isActive
                              ? 'bg-[#FF4D0A] text-white font-bold border-[#FF8738]'
                              : 'bg-white/[0.04] text-white/70 hover:text-white border-white/[0.08]'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Key Overview Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[10px] uppercase text-white/40 mb-1">Email Address</div>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-[#FF8738] hover:underline font-medium break-all"
                    >
                      {selectedLead.email}
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[10px] uppercase text-white/40 mb-1">Company / Brand</div>
                    <div className="text-white font-medium">{selectedLead.company || 'Not provided'}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[10px] uppercase text-white/40 mb-1">Requested Service</div>
                    <div className="text-white font-medium">{selectedLead.service}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-[10px] uppercase text-white/40 mb-1">Budget / Timeline</div>
                    <div className="text-white font-medium">
                      {selectedLead.budget || 'Flexible'} · {selectedLead.timeline || 'Flexible'}
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-white/50 mb-2">Project Description</h4>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-[#D3CBC4] leading-relaxed whitespace-pre-wrap">
                    {selectedLead.project_description}
                  </div>
                </div>

                {/* Diagnostics / Metadata */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-white/40 space-y-1">
                  <div>Source: <span className="text-white/60">{selectedLead.source || 'website_contact_form'}</span></div>
                  <div>Received: <span className="text-white/60">{new Date(selectedLead.created_at).toLocaleString()}</span></div>
                  {selectedLead.metadata?.ip_hash && (
                    <div>Client IP Hash: <span className="text-white/60">{selectedLead.metadata.ip_hash}</span></div>
                  )}
                </div>

                {/* Internal Team Notes Section */}
                <div className="border-t border-white/[0.08] pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#FF4D0A]" />
                      <span>Private Internal Notes</span>
                    </h4>
                    <span className="text-[11px] text-white/40">{notes.length} notes</span>
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleCreateNote} className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Add private note regarding phone consultation, proposal status, or scope..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      disabled={isAddingNote}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1B1411] border border-white/[0.08] focus:border-[#FF4D0A] text-xs font-mono text-white placeholder-white/30 focus:outline-none resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isAddingNote || !newNote.trim()}
                        className="px-4 py-2 rounded-xl bg-white text-black font-keania text-xs tracking-wider uppercase hover:bg-[#FF4D0A] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                      >
                        {isAddingNote ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Post Note</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  {isLoadingNotes ? (
                    <div className="py-6 text-center text-xs text-white/50">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2 text-[#FF4D0A]" />
                      <span>Loading notes...</span>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="py-4 text-center text-xs text-white/40">
                      No internal notes recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3.5 rounded-xl bg-[#1B1411] border border-white/[0.06] text-xs space-y-2 group"
                        >
                          <div className="flex items-center justify-between text-[11px] text-white/40">
                            <span className="font-bold text-[#FF8738]">{note.author_email}</span>
                            <div className="flex items-center gap-2">
                              <span>{new Date(note.created_at).toLocaleDateString()}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                title="Delete note"
                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 text-white/40 transition-opacity cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[#D3CBC4] leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
