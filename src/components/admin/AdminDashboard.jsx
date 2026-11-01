import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
  LayoutDashboard,
  Users,
  CheckSquare,
  FolderKanban,
  Settings,
  Menu,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react'
import {
  getAdminLeads,
  updateLeadStatus,
  getLeadNotes,
  addLeadNote,
  deleteLeadNote,
} from '../../services/adminService'

// Pipeline stages with accessible color tokens
const PIPELINE_STATUSES = [
  { key: 'all', label: 'All Enquiries', badgeColor: 'text-[#F5F5F0] bg-[#1C1C1C] border-[#2B2B2B]' },
  { key: 'new', label: 'New', badgeColor: 'text-[#C6FF00] bg-[#C6FF00]/10 border-[#C6FF00]/30' },
  { key: 'contacted', label: 'Contacted', badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { key: 'qualified', label: 'Qualified', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { key: 'proposal_sent', label: 'Proposal Sent', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { key: 'won', label: 'Won', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { key: 'lost', label: 'Lost', badgeColor: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30' },
]

const SERVICES_LIST = [
  'All Services',
  'Website Design',
  'Web Development',
  'UI/UX Design',
  'Branding',
  'Other',
]

// Studio Case Studies showcase for Projects tab
const STUDIO_PROJECTS = [
  {
    title: 'Atelier Estates',
    category: 'Architecture & Digital Platform',
    route: '/work/atelier-estates',
    description: 'High-end residential architectural showcase with immersive spatial gallery.',
    tag: 'Case Study',
  },
  {
    title: 'Aurelis Dental Clinic',
    category: 'Brand Identity & Web Experience',
    route: '/work/arulis-dental-clinic',
    description: 'Bespoke patient consultation portal with custom dental procedure monograph.',
    tag: 'Case Study',
  },
  {
    title: 'Maison de Sucre',
    category: 'Artisan Pastry E-Commerce',
    route: '/work/maison-de-sucre',
    description: 'Boutique Parisian patisserie storefront with real-time order scheduling.',
    tag: 'Case Study',
  },
  {
    title: 'AUREX Performance Club',
    category: 'Kinetic Fitness Digital Experience',
    route: '/work/aurex-performance-club',
    description: 'High-intensity athletic training club portal with interactive class calendar.',
    tag: 'Case Study',
  },
  {
    title: 'Drop Cult',
    category: 'Streetwear Storefront & Lookbook',
    route: '/work/drop-cult',
    description: 'Underground fashion label digital storefront featuring limited drops.',
    tag: 'Case Study',
  },
]

export default function AdminDashboard({ adminUser, onLogout, onNavigate }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'leads' | 'followups' | 'projects' | 'settings'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'cards'

  // Leads Data & Metrics
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

  // Filters & Search
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

  // Lead Detail Drawer & Internal Notes
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
      await updateLeadStatus(leadId, newStatus)
      // Update locally
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }))
      }
      loadLeads(pagination.page)
      showNotification(`Status updated to "${newStatus}"`)
    } catch (err) {
      alert(`Could not update status: ${err.message}`)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Open Lead Detail Drawer & fetch notes
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
      showNotification('Internal note saved successfully.')
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
    showNotification('Email copied to clipboard')
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  // Export current filtered leads to CSV
  const handleExportCSV = () => {
    if (!leads.length) {
      alert('No leads available to export.')
      return
    }

    const headers = ['ID', 'Date', 'Name', 'Email', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'Description']
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.created_at || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.project_description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `northup_leads_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification('CSV export downloaded.')
  }

  // Helper for status badge
  const getStatusBadge = (status) => {
    const s = PIPELINE_STATUSES.find((item) => item.key === status) || {
      label: status,
      badgeColor: 'text-[#F5F5F0] bg-[#1C1C1C] border-[#2B2B2B]',
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border uppercase tracking-wider ${s.badgeColor}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90" />
        {s.label}
      </span>
    )
  }

  // Format date cleanly
  const formatDate = (isoString) => {
    if (!isoString) return '—'
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return isoString
    }
  }

  // Filter leads that require follow-up
  const followUpLeads = useMemo(() => {
    return leads.filter((l) => l.status === 'new' || l.status === 'contacted')
  }, [leads])

  // Conversion rate metric
  const winRate = useMemo(() => {
    const closed = (metrics.won || 0) + (metrics.lost || 0)
    if (closed === 0) return 0
    return Math.round(((metrics.won || 0) / closed) * 100)
  }, [metrics.won, metrics.lost])

  return (
    <div className="h-screen w-full bg-[#0B0B0B] text-[#F5F5F0] flex overflow-hidden font-sans select-none antialiased">
      {/* =========================================================================
          1. SIDEBAR NAVIGATION
         ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-[#2B2B2B] flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#2B2B2B] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base uppercase text-[#F5F5F0]">
                NORTHUP STUDIO
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30">
                CRM
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#A1A1AA] mt-1">
              Internal Client Console
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#1C1C1C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto font-mono text-xs">
          {/* Overview */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1C1C1C] text-[#C6FF00] font-semibold border-l-2 border-[#C6FF00] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#1C1C1C]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          {/* Leads */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('leads')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#1C1C1C] text-[#C6FF00] font-semibold border-l-2 border-[#C6FF00] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#1C1C1C]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Leads Pipeline</span>
            </div>
            {metrics.new > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C6FF00] text-black">
                {metrics.new}
              </span>
            )}
          </button>

          {/* Follow-ups / Tasks */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('followups')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'followups'
                ? 'bg-[#1C1C1C] text-[#C6FF00] font-semibold border-l-2 border-[#C6FF00] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#1C1C1C]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4" />
              <span>Follow-up Queue</span>
            </div>
            {followUpLeads.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1C1C1C] border border-[#2B2B2B] text-[#A1A1AA]">
                {followUpLeads.length}
              </span>
            )}
          </button>

          {/* Case Studies / Projects */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#1C1C1C] text-[#C6FF00] font-semibold border-l-2 border-[#C6FF00] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#1C1C1C]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4" />
              <span>Case Studies</span>
            </div>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('settings')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1C1C1C] text-[#C6FF00] font-semibold border-l-2 border-[#C6FF00] shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#1C1C1C]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>System &amp; Admin</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer: Authenticated User & Actions */}
        <div className="p-4 border-t border-[#2B2B2B] bg-[#0E0E0E] space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#141414] border border-[#2B2B2B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C6FF00]/15 border border-[#C6FF00]/30 flex items-center justify-center text-[#C6FF00] font-bold text-xs flex-shrink-0">
                {(adminUser?.email || 'A')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#F5F5F0] font-medium truncate text-[11px]">
                  {adminUser?.email || 'admin@northupstudio.com'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00]" />
                  <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                    {adminUser?.role || 'SUPERADMIN'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex-1 py-2 px-3 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-[#A1A1AA] hover:text-[#F5F5F0] text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span>Website ↗</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* =========================================================================
          2. MAIN CONTENT AREA
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0B0B0B]">
        {/* Top Header */}
        <header className="h-16 bg-[#141414] border-b border-[#2B2B2B] px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-[#A1A1AA] hover:text-[#F5F5F0]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F5F0] flex items-center gap-2">
                {activeTab === 'overview' && 'AGENCY OVERVIEW'}
                {activeTab === 'leads' && 'LEAD MANAGEMENT & PIPELINE'}
                {activeTab === 'followups' && 'FOLLOW-UP QUEUE'}
                {activeTab === 'projects' && 'STUDIO CASE STUDIES'}
                {activeTab === 'settings' && 'SYSTEM & INFRASTRUCTURE'}
              </h1>
              <p className="text-[11px] font-mono text-[#A1A1AA] hidden sm:block">
                {activeTab === 'overview' && 'Real-time studio CRM metrics, inquiry volume, and conversion health.'}
                {activeTab === 'leads' && 'Review incoming inquiries, advance stages, and record internal team notes.'}
                {activeTab === 'followups' && 'Prioritized queue of active leads requiring immediate consultation follow-up.'}
                {activeTab === 'projects' && 'Production digital platforms and client monographs built by Northup Studio.'}
                {activeTab === 'settings' && 'Connected Supabase environment, Resend email status, and security gates.'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh database records"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-[#A1A1AA] hover:text-[#F5F5F0] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C6FF00]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* View Mode Toggle (Table vs Cards) */}
            {(activeTab === 'leads' || activeTab === 'overview') && (
              <div className="hidden sm:flex items-center bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    viewMode === 'table' ? 'bg-[#2B2B2B] text-[#C6FF00] font-semibold' : 'text-[#A1A1AA] hover:text-[#F5F5F0]'
                  }`}
                >
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    viewMode === 'cards' ? 'bg-[#2B2B2B] text-[#C6FF00] font-semibold' : 'text-[#A1A1AA] hover:text-[#F5F5F0]'
                  }`}
                >
                  Cards
                </button>
              </div>
            )}

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              title="Export leads to CSV"
              className="px-3 py-1.5 rounded-xl bg-[#C6FF00] hover:bg-[#b4ea00] text-black font-mono font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
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
              className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141414] border border-[#C6FF00]/40 text-[#C6FF00] text-xs font-mono shadow-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C6FF00]" />
              <span>{actionSuccessMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">{errorMessage}</div>
              <button
                type="button"
                onClick={() => loadLeads(1)}
                className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-xs font-bold"
              >
                Retry
              </button>
            </div>
          )}

          {/* =========================================================================
              VIEW A: OVERVIEW TAB
             ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 3. KPI SUMMARY CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {/* Total Leads */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                    <span>Total Enquiries</span>
                    <Inbox className="w-4 h-4 text-[#A1A1AA]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F0]">
                    {metrics.total || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A1A1AA] mt-1.5">
                    All-time website leads
                  </p>
                </div>

                {/* New Enquiries */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#C6FF00]/40 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#C6FF00]/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#C6FF00] font-semibold">New Enquiries</span>
                    <Sparkles className="w-4 h-4 text-[#C6FF00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#C6FF00]">
                    {metrics.new || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A1A1AA] mt-1.5">
                    Awaiting initial response
                  </p>
                </div>

                {/* Qualified */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                    <span>Qualified</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                    {metrics.qualified || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A1A1AA] mt-1.5">
                    High intent &amp; budget match
                  </p>
                </div>

                {/* Won Projects */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-sm">
                  <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                    <span>Won Projects</span>
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                    {metrics.won || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A1A1AA] mt-1.5">
                    Engaged studio contracts
                  </p>
                </div>

                {/* Lost Leads */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-sm col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-2">
                    <span>Lost / Archived</span>
                    <XCircle className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-400">
                    {metrics.lost || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A1A1AA] mt-1.5">
                    Out of scope / non-fit
                  </p>
                </div>
              </div>

              {/* Conversion & Pipeline Health Bar */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-sm font-mono">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-wider text-[#F5F5F0]">
                      Pipeline Distribution &amp; Win Rate
                    </h3>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                      Conversion efficiency: <span className="text-[#C6FF00] font-bold">{winRate}%</span> closed-won engagement rate.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
                      <span className="text-[#A1A1AA]">New ({metrics.new || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="text-[#A1A1AA]">Contacted ({metrics.contacted || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[#A1A1AA]">Qualified ({metrics.qualified || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-[#A1A1AA]">Proposal ({metrics.proposal_sent || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[#A1A1AA]">Won ({metrics.won || 0})</span>
                    </div>
                  </div>
                </div>

                {/* Multi-segment Progress Bar */}
                <div className="h-2.5 w-full bg-[#1C1C1C] rounded-full overflow-hidden flex border border-[#2B2B2B]">
                  {metrics.total > 0 ? (
                    <>
                      <div style={{ width: `${(metrics.new / metrics.total) * 100}%` }} className="bg-[#C6FF00] h-full" title="New" />
                      <div style={{ width: `${(metrics.contacted / metrics.total) * 100}%` }} className="bg-sky-400 h-full" title="Contacted" />
                      <div style={{ width: `${(metrics.qualified / metrics.total) * 100}%` }} className="bg-amber-400 h-full" title="Qualified" />
                      <div style={{ width: `${(metrics.proposal_sent / metrics.total) * 100}%` }} className="bg-purple-400 h-full" title="Proposal Sent" />
                      <div style={{ width: `${(metrics.won / metrics.total) * 100}%` }} className="bg-emerald-400 h-full" title="Won" />
                      <div style={{ width: `${(metrics.lost / metrics.total) * 100}%` }} className="bg-zinc-600 h-full" title="Lost" />
                    </>
                  ) : (
                    <div className="w-full bg-[#2B2B2B] h-full" />
                  )}
                </div>
              </div>

              {/* Two Column Layout: Recent Leads Queue + Follow-up Priority */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Leads */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#F5F5F0]">
                        Recent Inquiries
                      </h3>
                      <p className="font-mono text-[11px] text-[#A1A1AA]">
                        Latest client submissions through the official website.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-mono text-[#C6FF00] hover:underline cursor-pointer"
                    >
                      View all in Leads Pipeline &rarr;
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] text-center font-mono text-xs text-[#A1A1AA]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C6FF00] mb-2" />
                      Loading recent enquiries...
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#141414] border border-[#2B2B2B] text-center font-mono text-xs text-[#A1A1AA]">
                      No enquiries recorded yet.
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-[#141414] border border-[#2B2B2B] overflow-hidden divide-y divide-[#2B2B2B]">
                      {leads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          className="p-4 hover:bg-[#1C1C1C] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs cursor-pointer"
                          onClick={() => openLeadDetail(lead)}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#F5F5F0] truncate">
                                {lead.name}
                              </span>
                              {lead.company && (
                                <span className="text-[11px] text-[#A1A1AA]">
                                  &middot; {lead.company}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-[#A1A1AA]">
                              <span>{lead.service || 'Web Platform'}</span>
                              {lead.budget && (
                                <>
                                  <span>&middot;</span>
                                  <span className="text-[#C6FF00]">{lead.budget}</span>
                                </>
                              )}
                              <span>&middot;</span>
                              <span>{formatDate(lead.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getStatusBadge(lead.status)}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                openLeadDetail(lead)
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#1C1C1C] hover:bg-[#2B2B2B] text-[#F5F5F0] text-[11px] border border-[#2B2B2B]"
                            >
                              Review ↗
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right 1 Col: Follow-up Queue */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#F5F5F0]">
                      Follow-up Queue
                    </h3>
                    <p className="font-mono text-[11px] text-[#A1A1AA]">
                      Inquiries awaiting consultation response.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-3 font-mono text-xs">
                    {followUpLeads.length === 0 ? (
                      <div className="py-8 text-center text-[#A1A1AA]">
                        <CheckCircle2 className="w-8 h-8 text-[#C6FF00] mx-auto mb-2 opacity-80" />
                        <p className="font-semibold text-[#F5F5F0]">All caught up!</p>
                        <p className="text-[11px] text-[#A1A1AA] mt-1">
                          No pending client follow-ups in queue.
                        </p>
                      </div>
                    ) : (
                      followUpLeads.slice(0, 4).map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => openLeadDetail(lead)}
                          className="p-3 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] hover:border-[#3E3E3E] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#F5F5F0] truncate">
                              {lead.name}
                            </span>
                            {getStatusBadge(lead.status)}
                          </div>
                          <p className="text-[11px] text-[#A1A1AA] truncate">
                            {lead.service} {lead.budget ? `(${lead.budget})` : ''}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-[#A1A1AA]">
                            <span>Received: {formatDate(lead.created_at)}</span>
                            <span className="text-[#C6FF00] hover:underline">Open Drawer &rarr;</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW B: LEADS PIPELINE TAB
             ========================================================================= */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Pipeline Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2B2B2B] font-mono text-xs">
                {PIPELINE_STATUSES.map((status) => {
                  const count =
                    status.key === 'all'
                      ? metrics.total || 0
                      : metrics[status.key] || 0

                  return (
                    <button
                      key={status.key}
                      type="button"
                      onClick={() => setSelectedStatus(status.key)}
                      className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                        selectedStatus === status.key
                          ? 'bg-[#141414] text-[#C6FF00] border border-[#C6FF00]/40 font-bold shadow-sm'
                          : 'text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#141414]'
                      }`}
                    >
                      <span>{status.label}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                          selectedStatus === status.key
                            ? 'bg-[#C6FF00] text-black font-bold'
                            : 'bg-[#1C1C1C] text-[#A1A1AA]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search leads by name, email, company..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#141414] border border-[#2B2B2B] focus:border-[#C6FF00] text-[#F5F5F0] placeholder-[#A1A1AA] text-xs focus:outline-none transition-colors"
                  />
                  <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </form>

                <div className="flex items-center gap-2.5">
                  {/* Service Filter */}
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-[#141414] border border-[#2B2B2B] text-[#F5F5F0] text-xs focus:outline-none focus:border-[#C6FF00] cursor-pointer"
                    >
                      {SERVICES_LIST.map((srv) => (
                        <option key={srv} value={srv} className="bg-[#141414] text-[#F5F5F0]">
                          {srv}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Sort Order */}
                  <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="px-3 py-2.5 rounded-xl bg-[#141414] border border-[#2B2B2B] text-[#A1A1AA] hover:text-[#F5F5F0] text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#C6FF00]" />
                    <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                  </button>
                </div>
              </div>

              {/* Data View: Table or Cards */}
              {isLoading ? (
                <div className="p-16 rounded-2xl bg-[#141414] border border-[#2B2B2B] text-center font-mono text-xs text-[#A1A1AA]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C6FF00] mb-3" />
                  Retrieving leads from Supabase database...
                </div>
              ) : leads.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#141414] border border-[#2B2B2B] text-center font-mono text-xs text-[#A1A1AA]">
                  <Inbox className="w-10 h-10 mx-auto text-[#A1A1AA] mb-3 opacity-60" />
                  <p className="text-sm font-bold text-[#F5F5F0]">No matching enquiries found</p>
                  <p className="mt-1 text-[#A1A1AA]">
                    {search ? `No records matched search term "${search}".` : 'No leads match the selected filter criteria.'}
                  </p>
                  {(search || selectedStatus !== 'all' || selectedService !== 'All Services') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setSelectedStatus('all')
                        setSelectedService('All Services')
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#2B2B2B] text-[#C6FF00] text-xs font-bold border border-[#2B2B2B] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : viewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="rounded-2xl bg-[#141414] border border-[#2B2B2B] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#0E0E0E] text-[#A1A1AA] border-b border-[#2B2B2B] uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Client / Brand</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Budget &amp; Timeline</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Pipeline Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2B2B2B]">
                        {leads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-[#1C1C1C]/70 transition-colors cursor-pointer group"
                            onClick={() => openLeadDetail(lead)}
                          >
                            {/* Client & Company */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#F5F5F0] group-hover:text-[#C6FF00] transition-colors">
                                {lead.name}
                              </div>
                              {lead.company && (
                                <div className="text-[11px] text-[#A1A1AA]">
                                  {lead.company}
                                </div>
                              )}
                            </td>

                            {/* Contact Email */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-[#F5F5F0] hover:text-[#C6FF00] hover:underline"
                                >
                                  {lead.email}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(lead.email)}
                                  title="Copy Email"
                                  className="p-1 rounded text-[#A1A1AA] hover:text-[#F5F5F0] hover:bg-[#2B2B2B]"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Service */}
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-[#1C1C1C] border border-[#2B2B2B] text-[11px] text-[#F5F5F0]">
                                {lead.service || 'Web Platform'}
                              </span>
                            </td>

                            {/* Budget & Timeline */}
                            <td className="py-3.5 px-4 text-[11px]">
                              <div className="text-[#C6FF00] font-medium">
                                {lead.budget || 'Unspecified'}
                              </div>
                              <div className="text-[#A1A1AA]">
                                {lead.timeline || 'Flexible'}
                              </div>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-[11px] text-[#A1A1AA]">
                              {formatDate(lead.created_at)}
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="relative inline-block">
                                <select
                                  value={lead.status}
                                  disabled={updatingStatusId === lead.id}
                                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                  className="appearance-none pl-2.5 pr-6 py-1 rounded-full text-[11px] font-mono font-medium uppercase tracking-wider bg-[#1C1C1C] border border-[#2B2B2B] text-[#F5F5F0] focus:border-[#C6FF00] focus:outline-none cursor-pointer"
                                >
                                  <option value="new">● New</option>
                                  <option value="contacted">● Contacted</option>
                                  <option value="qualified">● Qualified</option>
                                  <option value="proposal_sent">● Proposal Sent</option>
                                  <option value="won">● Won</option>
                                  <option value="lost">● Lost</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-[#A1A1AA] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => openLeadDetail(lead)}
                                className="px-3 py-1 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-[#F5F5F0] text-[11px] hover:text-[#C6FF00] transition-colors"
                              >
                                Review ↗
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* CARDS VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => openLeadDetail(lead)}
                      className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#3E3E3E] transition-all flex flex-col justify-between font-mono text-xs cursor-pointer group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          {getStatusBadge(lead.status)}
                          <span className="text-[11px] text-[#A1A1AA]">
                            {formatDate(lead.created_at)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#F5F5F0] group-hover:text-[#C6FF00] transition-colors mb-0.5">
                          {lead.name}
                        </h4>
                        {lead.company && (
                          <p className="text-[11px] text-[#A1A1AA] mb-2">{lead.company}</p>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#2B2B2B] text-[10px] text-[#F5F5F0]">
                            {lead.service || 'Web Platform'}
                          </span>
                          {lead.budget && (
                            <span className="px-2 py-0.5 rounded bg-[#C6FF00]/10 border border-[#C6FF00]/30 text-[10px] text-[#C6FF00]">
                              {lead.budget}
                            </span>
                          )}
                          {lead.timeline && (
                            <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#2B2B2B] text-[10px] text-[#A1A1AA]">
                              {lead.timeline}
                            </span>
                          )}
                        </div>

                        {lead.project_description && (
                          <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-relaxed bg-[#0E0E0E] p-2.5 rounded-xl border border-[#2B2B2B]/60 mb-4">
                            {lead.project_description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#2B2B2B] flex items-center justify-between">
                        <span className="text-[11px] text-[#A1A1AA] truncate max-w-[150px]">
                          {lead.email}
                        </span>
                        <span className="text-[11px] text-[#C6FF00] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Details</span>
                          <span>&rarr;</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between font-mono text-xs text-[#A1A1AA] pt-2">
                  <div>
                    Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{' '}
                    {pagination.totalCount} enquiries
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => loadLeads(pagination.page - 1)}
                      className="p-2 rounded-xl bg-[#141414] border border-[#2B2B2B] text-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1C1C1C]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[#F5F5F0] px-2 font-bold">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadLeads(pagination.page + 1)}
                      className="p-2 rounded-xl bg-[#141414] border border-[#2B2B2B] text-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1C1C1C]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW C: FOLLOW-UP QUEUE TAB
             ========================================================================= */}
          {activeTab === 'followups' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F5F0]">
                  Client Follow-up Priority Queue
                </h2>
                <p className="text-xs font-mono text-[#A1A1AA] mt-1">
                  Active inquiries awaiting consultation scheduling or proposal submission.
                </p>
              </div>

              {followUpLeads.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#141414] border border-[#2B2B2B] text-center font-mono">
                  <ShieldCheck className="w-12 h-12 text-[#C6FF00] mx-auto mb-3 opacity-90" />
                  <h3 className="text-base font-bold text-[#F5F5F0]">All Follow-ups Completed</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-md mx-auto mt-1 leading-relaxed">
                    No active inquiries currently require follow-up. All received leads have been addressed or advanced through the pipeline.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {followUpLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] hover:border-[#3E3E3E] transition-all flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          {getStatusBadge(lead.status)}
                          <span className="text-[11px] text-[#A1A1AA]">
                            Received: {formatDate(lead.created_at)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#F5F5F0] mb-0.5">
                          {lead.name}
                        </h4>
                        {lead.company && (
                          <p className="text-[11px] text-[#A1A1AA] mb-2">{lead.company}</p>
                        )}

                        <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#2B2B2B] space-y-1.5 text-[11px] my-3">
                          <div className="flex justify-between">
                            <span className="text-[#A1A1AA]">Email:</span>
                            <a href={`mailto:${lead.email}`} className="text-[#F5F5F0] hover:text-[#C6FF00] hover:underline">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A1A1AA]">Service:</span>
                            <span className="text-[#F5F5F0]">{lead.service}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A1A1AA]">Budget:</span>
                            <span className="text-[#C6FF00]">{lead.budget || 'Flexible'}</span>
                          </div>
                        </div>

                        {lead.project_description && (
                          <p className="text-[11px] text-[#A1A1AA] line-clamp-3 leading-relaxed mb-4">
                            "{lead.project_description}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#2B2B2B] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(lead.id, 'contacted')}
                          className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-[#A1A1AA] hover:text-[#F5F5F0] text-[11px] transition-colors"
                        >
                          Mark Contacted
                        </button>

                        <button
                          type="button"
                          onClick={() => openLeadDetail(lead)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#C6FF00] hover:bg-[#b4ea00] text-black font-bold text-[11px] transition-colors"
                        >
                          Review &amp; Notes ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW D: CASE STUDIES / PROJECTS TAB
             ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F5F0]">
                  Studio Production Monographs
                </h2>
                <p className="text-xs font-mono text-[#A1A1AA] mt-1">
                  Verified original client projects and public portfolio case studies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
                {STUDIO_PROJECTS.map((proj) => (
                  <div
                    key={proj.route}
                    className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C6FF00]/15 text-[#C6FF00] border border-[#C6FF00]/30">
                          {proj.tag}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA]">{proj.category}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#F5F5F0] mb-1.5">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                        {proj.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(proj.route)}
                      className="w-full py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2B2B2B] text-[#F5F5F0] hover:text-[#C6FF00] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inspect Live Study</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW E: SETTINGS & INFRASTRUCTURE TAB
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl font-mono text-xs">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                  System Infrastructure &amp; Security
                </h2>
                <p className="text-[#A1A1AA] mt-1">
                  Active backend services, security boundaries, and authorization allowlists.
                </p>
              </div>

              {/* Admin Identity Card */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#C6FF00] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticated Administrator</span>
                </h3>
                <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Email:</span>
                    <span className="text-[#F5F5F0] font-bold">{adminUser?.email || 'northup4work@gmail.com'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Role:</span>
                    <span className="text-[#C6FF00] uppercase font-bold">{adminUser?.role || 'superadmin'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Security Scheme:</span>
                    <span className="text-[#F5F5F0]">Bearer JWT + Server-Side Allowlist</span>
                  </div>
                </div>
              </div>

              {/* Connected Services */}
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#2B2B2B] space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#F5F5F0] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C6FF00]" />
                  <span>Integrated Production Services</span>
                </h3>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#F5F5F0]">Supabase Database &amp; Auth</p>
                      <p className="text-[11px] text-[#A1A1AA]">Encrypted PostgreSQL with Row-Level Security (RLS)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      CONNECTED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#F5F5F0]">Resend Email Automation</p>
                      <p className="text-[11px] text-[#A1A1AA]">Admin alerts &amp; client acknowledgements</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#F5F5F0]">Vercel Serverless Functions</p>
                      <p className="text-[11px] text-[#A1A1AA]">Node runtime API endpoints: /api/contact, /api/admin/*</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      DEPLOYED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          3. LEAD DETAIL SLIDE-OUT DRAWER
         ========================================================================= */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 overflow-hidden font-mono">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-xl bg-[#141414] border-l border-[#2B2B2B] flex flex-col shadow-2xl text-[#F5F5F0] overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-[#2B2B2B] flex items-center justify-between bg-[#111111]">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#C6FF00] uppercase">
                      ENQUIRY DOSSIER
                    </span>
                    <h2 className="text-lg font-bold text-[#F5F5F0] mt-0.5 truncate max-w-xs sm:max-w-md">
                      {selectedLead.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedLead.email}?subject=Regarding%20Your%20Project%20Enquiry%20%7C%20Northup%20Studio`}
                      className="px-3 py-1.5 rounded-xl bg-[#C6FF00] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#b4ea00] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Email Client</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedLead(null)}
                      className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-[#A1A1AA] hover:text-[#F5F5F0]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                  {/* Status Lifecycle Selector */}
                  <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[11px]">
                        Pipeline Stage:
                      </span>
                      {getStatusBadge(selectedLead.status)}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      {['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(selectedLead.id, st)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                            selectedLead.status === st
                              ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                              : 'bg-[#141414] text-[#A1A1AA] border-[#2B2B2B] hover:text-[#F5F5F0]'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Client Details Grid */}
                  <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#2B2B2B]">
                      <span className="text-[#A1A1AA]">Work Email:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#F5F5F0] font-bold">{selectedLead.email}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedLead.email)}
                          className="p-1 rounded text-[#A1A1AA] hover:text-[#F5F5F0]"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#2B2B2B]">
                      <span className="text-[#A1A1AA]">Company / Brand:</span>
                      <span className="text-[#F5F5F0] font-bold">{selectedLead.company || 'Individual / Non-disclosed'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#2B2B2B]">
                      <span className="text-[#A1A1AA]">Service Requested:</span>
                      <span className="text-[#C6FF00] font-bold">{selectedLead.service || 'Web Platform'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#2B2B2B]">
                      <span className="text-[#A1A1AA]">Estimated Budget:</span>
                      <span className="text-[#F5F5F0] font-bold">{selectedLead.budget || 'Flexible'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#2B2B2B]">
                      <span className="text-[#A1A1AA]">Desired Timeline:</span>
                      <span className="text-[#F5F5F0] font-bold">{selectedLead.timeline || 'Flexible'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#A1A1AA]">Received At:</span>
                      <span className="text-[#A1A1AA]">{formatDate(selectedLead.created_at)}</span>
                    </div>
                  </div>

                  {/* Full Enquiry Message */}
                  <div>
                    <h3 className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                      Client Project Scope &amp; Message:
                    </h3>
                    <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs leading-relaxed text-[#F5F5F0] whitespace-pre-wrap">
                      {selectedLead.project_description || 'No additional scope notes provided.'}
                    </div>
                  </div>

                  {/* Internal Team Notes */}
                  <div className="pt-2 border-t border-[#2B2B2B] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold text-[#C6FF00] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Private Internal Notes</span>
                      </h3>
                      <span className="text-[10px] text-[#A1A1AA]">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                      </span>
                    </div>

                    {/* New Note Form */}
                    <form onSubmit={handleCreateNote} className="space-y-2">
                      <textarea
                        rows={3}
                        maxLength={3000}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add private team notes, call takeaways, or deal scopes..."
                        className="w-full p-3 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] focus:border-[#C6FF00] text-[#F5F5F0] placeholder-[#A1A1AA] text-xs focus:outline-none transition-colors"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#A1A1AA]">
                          {newNote.length}/3000
                        </span>
                        <button
                          type="submit"
                          disabled={isAddingNote || !newNote.trim()}
                          className="px-3.5 py-1.5 rounded-lg bg-[#C6FF00] hover:bg-[#b4ea00] disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {isAddingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>Add Note</span>
                        </button>
                      </div>
                    </form>

                    {/* Notes List */}
                    {isLoadingNotes ? (
                      <div className="py-6 text-center text-[#A1A1AA]">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#C6FF00] mb-2" />
                        Loading internal notes...
                      </div>
                    ) : notes.length === 0 ? (
                      <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-center text-[#A1A1AA] text-[11px]">
                        No internal notes recorded yet.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#A1A1AA]">
                              <span>{note.author_email}</span>
                              <div className="flex items-center gap-2">
                                <span>{formatDate(note.created_at)}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="text-red-400 hover:text-red-300 p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-[#F5F5F0] whitespace-pre-wrap leading-relaxed">
                              {note.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
