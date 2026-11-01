import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUpRight,
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
  Phone,
  MessageSquare,
  Video,
  FileCheck,
  UserCheck,
  CreditCard,
  HelpCircle,
  FileSignature,
  ArrowRight,
  SendHorizontal,
  Smartphone,
  Globe,
  Radio,
  Zap,
} from 'lucide-react'
import {
  getAdminLeads,
  updateLeadStatus,
  updateLeadCRM,
  getLeadNotes,
  addLeadNote,
  deleteLeadNote,
  getCommunicationLogs,
  sendCommunication,
  getProposals,
  createProposal,
  updateProposal,
  getMessageTemplates,
  updateMessageTemplate,
  scheduleDiscoveryMeeting,
  getAdminAudits,
  updateAuditRequest,
  convertAuditToLead,
} from '../../services/adminService'
import { STARTER_TEMPLATES, interpolateTemplate } from '../../services/templateData'
import ErrorBoundary from './ErrorBoundary'

// Pipeline stages with Northup Studio Orange & Charcoal color tokens
const PIPELINE_STATUSES = [
  { key: 'all', label: 'All Enquiries', badgeColor: 'text-[#F5F1EB] bg-[#1D1D1D] border-[#303030]' },
  { key: 'new', label: 'New', badgeColor: 'text-[#FF8A3D] bg-[#FF8A3D]/10 border-[#FF8A3D]/30' },
  { key: 'contacted', label: 'Contacted', badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { key: 'qualified', label: 'Qualified', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { key: 'proposal_sent', label: 'Proposal Sent', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { key: 'negotiation', label: 'Negotiation', badgeColor: 'text-[#E96D24] bg-[#E96D24]/10 border-[#E96D24]/30' },
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

// Studio Production Case Studies
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
    description: 'Bespoke patient consultation portal with custom procedure monograph.',
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

export default function AdminDashboard({
  adminUser,
  onLogout,
  onNavigate,
  initialTab = 'overview',
  initialAudits = [],
  initialSelectedAudit = null,
}) {
  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab) // 'overview' | 'leads' | 'clients' | 'proposals' | 'projects' | 'tasks' | 'templates' | 'settings'
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
    negotiation: 0,
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

  // Audit Requests State
  const [audits, setAudits] = useState(initialAudits)
  const [auditMetrics, setAuditMetrics] = useState({ total: 0, new: 0, in_progress: 0, completed: 0, rejected: 0 })
  const [selectedAuditStatus, setSelectedAuditStatus] = useState('all')
  const [auditSearch, setAuditSearch] = useState('')
  const [isAuditsLoading, setIsAuditsLoading] = useState(false)
  const [auditsError, setAuditsError] = useState(null)
  const [auditMigrationPending, setAuditMigrationPending] = useState(false)
  const [selectedAudit, setSelectedAudit] = useState(initialSelectedAudit)
  const [auditConvertingId, setAuditConvertingId] = useState(null)
  const [editingAuditNotesId, setEditingAuditNotesId] = useState(null)
  const [auditNotesDraft, setAuditNotesDraft] = useState('')

  // Selected Lead & Drawer
  const [selectedLead, setSelectedLead] = useState(null)
  const [notes, setNotes] = useState([])
  const [commLogs, setCommLogs] = useState([])
  const [leadProposals, setLeadProposals] = useState([])
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)
  const [isLoadingComm, setIsLoadingComm] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  // Follow-up Date Editing
  const [editingFollowUp, setEditingFollowUp] = useState(false)
  const [followUpInput, setFollowUpInput] = useState('')

  // Communication Action Modal State
  const [commModalOpen, setCommModalOpen] = useState(false)
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('initial_acknowledgement')
  const [commChannel, setCommChannel] = useState('email') // 'email' | 'whatsapp' | 'both'
  const [commSubject, setCommSubject] = useState('')
  const [commContent, setCommContent] = useState('')
  const [commRecipientEmail, setCommRecipientEmail] = useState('')
  const [commRecipientPhone, setCommRecipientPhone] = useState('')
  const [isSendingComm, setIsSendingComm] = useState(false)
  const [commSendResult, setCommSendResult] = useState(null)

  // Proposal Creation Modal State
  const [proposalModalOpen, setProposalModalOpen] = useState(false)
  const [proposalTitle, setProposalTitle] = useState('')
  const [proposalOverview, setProposalOverview] = useState('')
  const [proposalDeliverables, setProposalDeliverables] = useState([
    'Custom High-Performance Architecture',
    'Interactive Three.js Visual Monograph',
    'Technical SEO & Structured Schema Data',
    'CMS Integration & Admin Operations Console',
  ])
  const [proposalMilestones, setProposalMilestones] = useState([
    { name: 'Architecture & Design Prototyping', timeline: 'Week 1–2' },
    { name: 'Core Engineering & Motion Development', timeline: 'Week 3–4' },
    { name: 'Production QA, SEO Pre-rendering & Deployment', timeline: 'Week 5' },
  ])
  const [proposalLineItems, setProposalLineItems] = useState([
    { description: 'Design Direction & UX Prototyping', amount: 3500 },
    { description: 'Custom Full-Stack Engineering & WebGL', amount: 6500 },
    { description: 'Technical SEO & Performance Optimization', amount: 1500 },
  ])
  const [proposalCurrency, setProposalCurrency] = useState('USD')
  const [proposalTerms, setProposalTerms] = useState('50% upon commencement, 50% upon production deployment.')
  const [isCreatingProposal, setIsCreatingProposal] = useState(false)
  const [selectedProposalToView, setSelectedProposalToView] = useState(null)

  // Discovery Meeting Scheduler Modal
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [meetingDate, setMeetingDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10))
  const [meetingTime, setMeetingTime] = useState('14:00')
  const [meetingDuration, setMeetingDuration] = useState(30)
  const [meetingTimezone, setMeetingTimezone] = useState('UTC')
  const [manualMeetLink, setManualMeetLink] = useState('https://meet.google.com/new')
  const [isSchedulingMeeting, setIsSchedulingMeeting] = useState(false)

  // Template Center State
  const [templatesList, setTemplatesList] = useState(STARTER_TEMPLATES)
  const [editingTemplateKey, setEditingTemplateKey] = useState(null)
  const [editingTemplateData, setEditingTemplateData] = useState(null)
  const [templateTesterLead, setTemplateTesterLead] = useState(null)

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

  // Fetch audits from serverless API
  const loadAudits = useCallback(async () => {
    setIsAuditsLoading(true)
    setAuditsError(null)
    try {
      const data = await getAdminAudits({
        status: selectedAuditStatus,
        search: auditSearch,
      })
      if (data?.migrationPending) {
        setAuditMigrationPending(true)
      } else {
        setAuditMigrationPending(false)
        setAudits(Array.isArray(data?.audits) ? data.audits : [])
        if (data?.metrics) setAuditMetrics(data.metrics)
      }
    } catch (err) {
      console.warn('Failed to load audits:', err.message)
      setAuditsError(err.message || 'Failed to load audit requests.')
    } finally {
      setIsAuditsLoading(false)
    }
  }, [selectedAuditStatus, auditSearch])

  useEffect(() => {
    loadLeads(1)
  }, [selectedStatus, selectedService, sortOrder])

  useEffect(() => {
    if (activeTab === 'audits' || activeTab === 'overview') {
      loadAudits()
    }
  }, [activeTab, loadAudits])

  const handleAuditStatusChange = async (auditId, status) => {
    try {
      await updateAuditRequest(auditId, { status })
      setAudits((prev) => prev.map((a) => (a.id === auditId ? { ...a, status } : a)))
      if (selectedAudit?.id === auditId) {
        setSelectedAudit((prev) => (prev ? { ...prev, status } : null))
      }
      showNotification(`Audit status set to "${status.toUpperCase()}"`)
      loadAudits()
    } catch (err) {
      alert(`Could not update audit status: ${err.message}`)
    }
  }

  const handleAuditNotesSave = async (auditId, notesToSave) => {
    const textToSave = notesToSave !== undefined ? notesToSave : auditNotesDraft
    try {
      await updateAuditRequest(auditId, { admin_notes: textToSave })
      setAudits((prev) => prev.map((a) => (a.id === auditId ? { ...a, admin_notes: textToSave } : a)))
      if (selectedAudit?.id === auditId) {
        setSelectedAudit((prev) => (prev ? { ...prev, admin_notes: textToSave } : null))
      }
      setEditingAuditNotesId(null)
      showNotification('Audit internal notes saved')
    } catch (err) {
      alert(`Could not save notes: ${err.message}`)
    }
  }

  const handleConvertAudit = async (auditId) => {
    if (!confirm('Convert this audit request into a qualified CRM lead?')) return
    setAuditConvertingId(auditId)
    try {
      const res = await convertAuditToLead(auditId)
      showNotification(res.message || 'Audit converted to qualified lead!')
      if (selectedAudit?.id === auditId) {
        setSelectedAudit((prev) => (prev ? { ...prev, status: 'completed', converted_lead_id: res.leadId } : null))
      }
      loadAudits()
      loadLeads(1)
    } catch (err) {
      alert(`Could not convert audit: ${err.message}`)
    } finally {
      setAuditConvertingId(null)
    }
  }

  // Load Templates
  useEffect(() => {
    getMessageTemplates()
      .then((data) => {
        if (data && data.length) setTemplatesList(data)
      })
      .catch((err) => console.warn('Using starter templates:', err.message))
  }, [])

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadLeads(1)
  }

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    loadLeads(pagination.page)
    loadAudits()
  }

  // Show Toast
  const showNotification = (msg) => {
    setActionSuccessMessage(msg)
    setTimeout(() => setActionSuccessMessage(null), 3500)
  }

  // Copy helper
  const copyToClipboard = (text, label = 'Copied to clipboard') => {
    navigator.clipboard.writeText(text)
    setCopiedEmail(text)
    showNotification(label)
    setTimeout(() => setCopiedEmail(null), 2000)
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
      showNotification(`Pipeline stage updated to "${newStatus.replace('_', ' ').toUpperCase()}"`)
    } catch (err) {
      alert(`Could not update status: ${err.message}`)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Convert Won Lead to Client
  const handleConvertLeadToClient = async (lead) => {
    if (!confirm(`Confirm converting ${lead.name} to an active Client Engagement? This records project commencement.`)) {
      return
    }

    try {
      const updated = await updateLeadCRM(lead.id, {
        status: 'won',
        converted_at: new Date().toISOString(),
        converted_client_id: `CL-${Date.now().toString().slice(-4)}`,
      })
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, ...updated } : l)))
      if (selectedLead?.id === lead.id) {
        setSelectedLead((prev) => ({ ...prev, ...updated }))
      }
      showNotification(`Client converted successfully (${updated.converted_client_id || 'Active'}).`)
      loadLeads(pagination.page)
    } catch (err) {
      alert(`Conversion error: ${err.message}`)
    }
  }

  // Open Lead Detail Drawer & fetch notes + comms + proposals
  const openLeadDetail = async (lead) => {
    setSelectedLead(lead)
    setFollowUpInput(lead.next_follow_up_date ? lead.next_follow_up_date.slice(0, 10) : '')
    setEditingFollowUp(false)
    setIsLoadingNotes(true)
    setIsLoadingComm(true)
    setNotes([])
    setCommLogs([])
    setLeadProposals([])

    try {
      const [leadNotes, commHistory, proposals] = await Promise.all([
        getLeadNotes(lead.id).catch(() => []),
        getCommunicationLogs(lead.id).catch(() => []),
        getProposals(lead.id).catch(() => []),
      ])
      setNotes(leadNotes)
      setCommLogs(commHistory)
      setLeadProposals(proposals)
    } finally {
      setIsLoadingNotes(false)
      setIsLoadingComm(false)
    }
  }

  // Save Follow-up Date
  const handleSaveFollowUpDate = async () => {
    if (!selectedLead) return
    try {
      const updated = await updateLeadCRM(selectedLead.id, {
        next_follow_up_date: followUpInput ? new Date(followUpInput).toISOString() : null,
        follow_up_completed: false,
      })
      setSelectedLead((prev) => ({ ...prev, ...updated }))
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, ...updated } : l)))
      setEditingFollowUp(false)
      showNotification('Follow-up scheduled.')
    } catch (err) {
      alert(`Error updating follow-up: ${err.message}`)
    }
  }

  // Toggle Follow-up Completed
  const handleToggleFollowUpCompleted = async () => {
    if (!selectedLead) return
    const newState = !selectedLead.follow_up_completed
    try {
      const updated = await updateLeadCRM(selectedLead.id, { follow_up_completed: newState })
      setSelectedLead((prev) => ({ ...prev, ...updated }))
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, ...updated } : l)))
      showNotification(newState ? 'Follow-up marked complete' : 'Follow-up reopened')
    } catch (err) {
      alert(`Error updating follow-up: ${err.message}`)
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

  // Prepare & Open Communication Modal
  const openCommunicationModal = (templateKeyToUse = 'initial_acknowledgement') => {
    if (!selectedLead) return
    const tpl = templatesList.find((t) => t.key === templateKeyToUse) || templatesList[0]
    setSelectedTemplateKey(tpl.key)
    setCommRecipientEmail(selectedLead.email || '')
    setCommRecipientPhone(selectedLead.phone || '')
    setCommSendResult(null)

    // Interpolate with actual lead data
    const vars = {
      client_name: selectedLead.name,
      service_name: selectedLead.service || 'Web Platform',
      project_name: selectedLead.company ? `${selectedLead.company} Web Platform` : `${selectedLead.name} Digital Platform`,
      next_step: 'Schedule a discovery session',
    }

    const { text: subjectText } = interpolateTemplate(tpl.subject || 'Message from Northup Studio', vars)
    const { text: bodyText } = interpolateTemplate(commChannel === 'whatsapp' ? tpl.body_whatsapp : tpl.body_email, vars)

    setCommSubject(subjectText)
    setCommContent(bodyText)
    setCommModalOpen(true)
  }

  // Switch template inside modal
  const handleTemplateSelectionChange = (newKey) => {
    setSelectedTemplateKey(newKey)
    if (!selectedLead) return
    const tpl = templatesList.find((t) => t.key === newKey) || templatesList[0]

    const vars = {
      client_name: selectedLead.name,
      service_name: selectedLead.service || 'Web Platform',
      project_name: selectedLead.company ? `${selectedLead.company} Web Platform` : `${selectedLead.name} Digital Platform`,
      next_step: 'Schedule a discovery session',
    }

    const { text: subjectText } = interpolateTemplate(tpl.subject || 'Message from Northup Studio', vars)
    const { text: bodyText } = interpolateTemplate(commChannel === 'whatsapp' ? tpl.body_whatsapp : tpl.body_email, vars)

    setCommSubject(subjectText)
    setCommContent(bodyText)
  }

  // Dispatch Communication (Email / WhatsApp)
  const handleSendCommunication = async () => {
    if (!selectedLead || !commContent.trim()) return
    setIsSendingComm(true)
    setCommSendResult(null)

    try {
      const res = await sendCommunication({
        leadId: selectedLead.id,
        channel: commChannel,
        recipient: commRecipientEmail,
        recipientPhone: commRecipientPhone,
        subject: commSubject,
        content: commContent.trim(),
        templateKey: selectedTemplateKey,
      })

      setCommSendResult(res)
      if (res.log) {
        setCommLogs((prev) => [res.log, ...prev])
      }

      if (res.success) {
        showNotification(commChannel === 'whatsapp' && res.status === 'manual_opened' ? 'Opening WhatsApp draft...' : 'Communication dispatched.')
        if (res.waLink && commChannel === 'whatsapp') {
          window.open(res.waLink, '_blank', 'noopener,noreferrer')
        }
      }
    } catch (err) {
      alert(`Communication error: ${err.message}`)
    } finally {
      setIsSendingComm(false)
    }
  }

  // Schedule Discovery Meeting
  const handleScheduleMeetingSubmit = async (e) => {
    e.preventDefault()
    if (!selectedLead) return
    setIsSchedulingMeeting(true)

    try {
      const res = await scheduleDiscoveryMeeting({
        leadId: selectedLead.id,
        clientName: selectedLead.name,
        clientEmail: selectedLead.email,
        meetingDate,
        meetingTime,
        durationMinutes: meetingDuration,
        timezone: meetingTimezone,
        manualMeetingLink: manualMeetLink,
        agenda: `Review requirements for ${selectedLead.service || 'Web Platform'}.`,
      })

      showNotification('Consultation scheduled & logged.')
      setMeetingModalOpen(false)

      // Refresh communication history
      const updatedLogs = await getCommunicationLogs(selectedLead.id)
      setCommLogs(updatedLogs)
      loadLeads(pagination.page)
    } catch (err) {
      alert(`Scheduling error: ${err.message}`)
    } finally {
      setIsSchedulingMeeting(false)
    }
  }

  // Create Proposal
  const handleCreateProposalSubmit = async (e) => {
    e.preventDefault()
    if (!selectedLead || !proposalTitle.trim()) return
    setIsCreatingProposal(true)

    const subtotal = proposalLineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
    const total_amount = subtotal

    try {
      const created = await createProposal({
        lead_id: selectedLead.id,
        title: proposalTitle.trim(),
        client_name: selectedLead.name,
        client_email: selectedLead.email,
        client_company: selectedLead.company,
        project_overview: proposalOverview.trim(),
        deliverables: proposalDeliverables,
        milestones: proposalMilestones,
        line_items: proposalLineItems,
        currency: proposalCurrency,
        subtotal,
        total_amount,
        payment_terms: proposalTerms,
        valid_until: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      })

      setLeadProposals((prev) => [created, ...prev])
      showNotification(`Proposal ${created.proposal_number} drafted.`)
      setProposalModalOpen(false)
    } catch (err) {
      alert(`Proposal error: ${err.message}`)
    } finally {
      setIsCreatingProposal(false)
    }
  }

  // Export current filtered leads to CSV
  const handleExportCSV = () => {
    if (!leads.length) {
      alert('No leads available to export.')
      return
    }

    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'FollowUpDate', 'Description']
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.created_at || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.next_follow_up_date || ''}"`,
      `"${(l.project_description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `northup_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification('CSV export downloaded.')
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

  // Fallback alias to guarantee no undefined reference crashes
  const formatReceivedDate = formatDate

  // Helper for status badge
  const getStatusBadge = (status) => {
    const s = PIPELINE_STATUSES.find((item) => item.key === status) || {
      label: status,
      badgeColor: 'text-[#F5F1EB] bg-[#1D1D1D] border-[#303030]',
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

  // Derived Lead Collections
  const followUpLeads = useMemo(() => {
    return leads.filter((l) => (l.status === 'new' || l.status === 'contacted' || l.next_follow_up_date) && !l.follow_up_completed)
  }, [leads])

  const wonClients = useMemo(() => {
    return leads.filter((l) => l.status === 'won' || l.converted_at)
  }, [leads])

  const winRate = useMemo(() => {
    const closed = (metrics.won || 0) + (metrics.lost || 0)
    if (closed === 0) return 0
    return Math.round(((metrics.won || 0) / closed) * 100)
  }, [metrics.won, metrics.lost])

  return (
    <div className="h-screen w-full bg-[#0C0C0C] text-[#F5F1EB] flex overflow-hidden font-sans select-none antialiased">
      {/* =========================================================================
          1. COMPACT GLASS SIDEBAR
         ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#151515]/95 backdrop-blur-xl border-r border-[#303030] flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#303030] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm uppercase text-[#F5F1EB]">
                NORTHUP STUDIO
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-[#FF8A3D]/15 text-[#FF8A3D] border border-[#FF8A3D]/30">
                CRM
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#A6A09A] mt-0.5">
              Client Operations Workspace
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto font-mono text-xs">
          {/* Overview */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
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
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Leads Pipeline</span>
            </div>
            {metrics.new > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8A3D] text-black">
                {metrics.new}
              </span>
            )}
          </button>

          {/* Audit Requests */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('audits')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'audits'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4" />
              <span>Audit Requests</span>
            </div>
            {auditMetrics?.new > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8A3D] text-black">
                {auditMetrics.new}
              </span>
            ) : auditMetrics?.total > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1D1D1D] border border-[#303030] text-[#A6A09A]">
                {auditMetrics.total}
              </span>
            ) : null}
          </button>

          {/* Clients */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('clients')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Active Clients</span>
            </div>
            {wonClients.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1D1D1D] border border-[#303030] text-[#A6A09A]">
                {wonClients.length}
              </span>
            )}
          </button>

          {/* Proposals */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('proposals')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'proposals'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSignature className="w-4 h-4" />
              <span>Proposals Hub</span>
            </div>
            {metrics.proposal_sent > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1D1D1D] border border-[#303030] text-[#A6A09A]">
                {metrics.proposal_sent}
              </span>
            )}
          </button>

          {/* Follow-up Tasks */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('tasks')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4" />
              <span>Tasks &amp; Follow-ups</span>
            </div>
            {followUpLeads.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8A3D]/20 text-[#FF8A3D]">
                {followUpLeads.length}
              </span>
            )}
          </button>

          {/* Template Center */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('templates')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Template Center</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#A6A09A] bg-[#1D1D1D]">
              14
            </span>
          </button>

          {/* Projects */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
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
                ? 'bg-[#1D1D1D] text-[#FF8A3D] font-semibold border-l-2 border-[#FF8A3D] shadow-[0_0_15px_rgba(255,138,61,0.12)]'
                : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Integrations</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#303030] bg-[#101010] space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#151515] border border-[#303030]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF8A3D]/15 border border-[#FF8A3D]/30 flex items-center justify-center text-[#FF8A3D] font-bold text-xs flex-shrink-0">
                {(adminUser?.email || 'N')[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#F5F1EB] font-medium truncate text-[11px]">
                  {adminUser?.email || 'admin@northupstudio.com'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]" />
                  <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider">
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
              className="flex-1 py-2 px-3 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#A6A09A] hover:text-[#F5F1EB] text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF8A3D]" />
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0C0C0C]">
        {/* Top Header */}
        <header className="h-16 bg-[#151515]/90 backdrop-blur-md border-b border-[#303030] px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#1D1D1D] border border-[#303030] text-[#A6A09A] hover:text-[#F5F1EB]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB] flex items-center gap-2">
                {activeTab === 'overview' && 'AGENCY OVERVIEW'}
                {activeTab === 'leads' && 'LEAD MANAGEMENT & PIPELINE'}
                {activeTab === 'audits' && 'FREE DIGITAL AUDIT REQUESTS'}
                {activeTab === 'clients' && 'CLIENT OPERATIONS'}
                {activeTab === 'proposals' && 'PROPOSALS & SCOPES'}
                {activeTab === 'tasks' && 'TASKS & FOLLOW-UP QUEUE'}
                {activeTab === 'templates' && 'CLIENT COMMUNICATION TEMPLATES'}
                {activeTab === 'projects' && 'STUDIO CASE STUDIES'}
                {activeTab === 'settings' && 'SYSTEM INTEGRATIONS & GATES'}
              </h1>
              <p className="text-[11px] font-mono text-[#A6A09A] hidden sm:block">
                {activeTab === 'overview' && 'Real-time studio CRM metrics, client conversion rate, and pipeline health.'}
                {activeTab === 'leads' && 'Review incoming inquiries, update lifecycle stages, and personalize client outreach.'}
                {activeTab === 'audits' && 'Evaluate prospective client website submissions, record notes, and convert to CRM leads.'}
                {activeTab === 'clients' && 'Active engaged accounts, project deliverables, and client communications.'}
                {activeTab === 'proposals' && 'Generate, personalize, and track itemized client proposals and scope agreements.'}
                {activeTab === 'tasks' && 'Prioritized queue of active leads requiring immediate consultation follow-up.'}
                {activeTab === 'templates' && '14 professional agency message templates ready for Email & WhatsApp.'}
                {activeTab === 'projects' && 'Production digital platforms and monographs built by Northup Studio.'}
                {activeTab === 'settings' && 'Resend email, WhatsApp Cloud API guide, Google Meet OAuth, and database status.'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh database records"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#A6A09A] hover:text-[#F5F1EB] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF8A3D]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* View Mode Toggle */}
            {(activeTab === 'leads' || activeTab === 'clients') && (
              <div className="hidden sm:flex items-center bg-[#1D1D1D] border border-[#303030] rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    viewMode === 'table' ? 'bg-[#303030] text-[#FF8A3D] font-semibold' : 'text-[#A6A09A] hover:text-[#F5F1EB]'
                  }`}
                >
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    viewMode === 'cards' ? 'bg-[#303030] text-[#FF8A3D] font-semibold' : 'text-[#A6A09A] hover:text-[#F5F1EB]'
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
              className="px-3 py-1.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-mono font-bold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,138,61,0.25)] active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </header>

        {/* Notification Toast */}
        <AnimatePresence>
          {actionSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#1D1D1D] border border-[#FF8A3D]/50 text-[#FF8A3D] text-xs font-mono shadow-2xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FF8A3D]" />
              <span>{actionSuccessMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Error Banner */}
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
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                {/* Total Leads */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#303030] shadow-sm">
                  <div className="flex items-center justify-between text-[#A6A09A] text-xs font-mono mb-2">
                    <span>Total Enquiries</span>
                    <Inbox className="w-4 h-4 text-[#A6A09A]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F1EB]">
                    {metrics.total || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A6A09A] mt-1.5">
                    Website inquiries
                  </p>
                </div>

                {/* New Enquiries */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#FF8A3D]/40 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF8A3D]/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#FF8A3D] font-bold">New Enquiries</span>
                    <Sparkles className="w-4 h-4 text-[#FF8A3D]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#FF8A3D]">
                    {metrics.new || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A6A09A] mt-1.5">
                    Awaiting response
                  </p>
                </div>

                {/* Qualified */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#303030] shadow-sm">
                  <div className="flex items-center justify-between text-[#A6A09A] text-xs font-mono mb-2">
                    <span>Qualified</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                    {metrics.qualified || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A6A09A] mt-1.5">
                    Scope verified
                  </p>
                </div>

                {/* Proposals Sent */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#303030] shadow-sm">
                  <div className="flex items-center justify-between text-[#A6A09A] text-xs font-mono mb-2">
                    <span>Proposals Sent</span>
                    <FileSignature className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-400">
                    {metrics.proposal_sent || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A6A09A] mt-1.5">
                    Pending decision
                  </p>
                </div>

                {/* Won Projects */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#303030] shadow-sm">
                  <div className="flex items-center justify-between text-[#A6A09A] text-xs font-mono mb-2">
                    <span>Won Projects</span>
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                    {metrics.won || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A6A09A] mt-1.5">
                    Active client deals
                  </p>
                </div>

                {/* Lost Leads */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#151515] border border-[#303030] shadow-sm col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-[#A6A09A] text-xs font-mono mb-2">
                    <span>Lost / Archived</span>
                    <XCircle className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-400">
                    {metrics.lost || 0}
                  </div>
                  <p className="text-[11px] font-mono text-[#A6A09A] mt-1.5">
                    Non-fit / archived
                  </p>
                </div>
              </div>

              {/* Conversion & Pipeline Health Bar */}
              <div className="p-5 rounded-2xl bg-[#151515] border border-[#303030] shadow-sm font-mono">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-wider text-[#F5F1EB]">
                      Pipeline Distribution &amp; Win Rate
                    </h3>
                    <p className="text-[11px] text-[#A6A09A] mt-0.5">
                      Conversion efficiency: <span className="text-[#FF8A3D] font-bold">{winRate}%</span> closed-won engagement rate.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF8A3D]" />
                      <span className="text-[#A6A09A]">New ({metrics.new || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="text-[#A6A09A]">Contacted ({metrics.contacted || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[#A6A09A]">Qualified ({metrics.qualified || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-[#A6A09A]">Proposal ({metrics.proposal_sent || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E96D24]" />
                      <span className="text-[#A6A09A]">Negotiation ({metrics.negotiation || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[#A6A09A]">Won ({metrics.won || 0})</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 w-full bg-[#1D1D1D] rounded-full overflow-hidden flex border border-[#303030]">
                  {metrics.total > 0 ? (
                    <>
                      <div style={{ width: `${(metrics.new / metrics.total) * 100}%` }} className="bg-[#FF8A3D] h-full" title="New" />
                      <div style={{ width: `${(metrics.contacted / metrics.total) * 100}%` }} className="bg-sky-400 h-full" title="Contacted" />
                      <div style={{ width: `${(metrics.qualified / metrics.total) * 100}%` }} className="bg-amber-400 h-full" title="Qualified" />
                      <div style={{ width: `${(metrics.proposal_sent / metrics.total) * 100}%` }} className="bg-purple-400 h-full" title="Proposal Sent" />
                      <div style={{ width: `${((metrics.negotiation || 0) / metrics.total) * 100}%` }} className="bg-[#E96D24] h-full" title="Negotiation" />
                      <div style={{ width: `${(metrics.won / metrics.total) * 100}%` }} className="bg-emerald-400 h-full" title="Won" />
                      <div style={{ width: `${(metrics.lost / metrics.total) * 100}%` }} className="bg-zinc-600 h-full" title="Lost" />
                    </>
                  ) : (
                    <div className="w-full bg-[#303030] h-full" />
                  )}
                </div>
              </div>

              {/* Two Column Layout: Recent Leads Queue + Follow-up Priority */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Leads */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#F5F1EB]">
                        Recent Client Inquiries
                      </h3>
                      <p className="font-mono text-[11px] text-[#A6A09A]">
                        Live submissions received through the agency website.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('leads')}
                      className="text-xs font-mono text-[#FF8A3D] hover:underline cursor-pointer"
                    >
                      View All in Pipeline &rarr;
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="p-8 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono text-xs text-[#A6A09A]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF8A3D] mb-2" />
                      Loading recent enquiries...
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono text-xs text-[#A6A09A]">
                      No enquiries recorded yet.
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-[#151515] border border-[#303030] overflow-hidden divide-y divide-[#303030]">
                      {leads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          className="p-4 hover:bg-[#1D1D1D] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs cursor-pointer"
                          onClick={() => openLeadDetail(lead)}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#F5F1EB] truncate">
                                {lead.name}
                              </span>
                              {lead.company && (
                                <span className="text-[11px] text-[#A6A09A]">
                                  &middot; {lead.company}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-[#A6A09A]">
                              <span>{lead.service || 'Web Platform'}</span>
                              {lead.budget && (
                                <>
                                  <span>&middot;</span>
                                  <span className="text-[#FF8A3D]">{lead.budget}</span>
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
                              className="px-2.5 py-1 rounded-lg bg-[#1D1D1D] hover:bg-[#282828] text-[#F5F1EB] text-[11px] border border-[#303030]"
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
                    <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#F5F1EB]">
                      Follow-up Queue
                    </h3>
                    <p className="font-mono text-[11px] text-[#A6A09A]">
                      Leads awaiting consultation outreach.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#151515] border border-[#303030] space-y-3 font-mono text-xs">
                    {followUpLeads.length === 0 ? (
                      <div className="py-8 text-center text-[#A6A09A]">
                        <CheckCircle2 className="w-8 h-8 text-[#FF8A3D] mx-auto mb-2 opacity-80" />
                        <p className="font-semibold text-[#F5F1EB]">All caught up!</p>
                        <p className="text-[11px] text-[#A6A09A] mt-1">
                          No pending client follow-ups in queue.
                        </p>
                      </div>
                    ) : (
                      followUpLeads.slice(0, 4).map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => openLeadDetail(lead)}
                          className="p-3 rounded-xl bg-[#1D1D1D] border border-[#303030] hover:border-[#454545] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#F5F1EB] truncate">
                              {lead.name}
                            </span>
                            {getStatusBadge(lead.status)}
                          </div>
                          <p className="text-[11px] text-[#A6A09A] truncate">
                            {lead.service} {lead.budget ? `(${lead.budget})` : ''}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[10px] text-[#A6A09A]">
                            <span>Received: {formatDate(lead.created_at)}</span>
                            <span className="text-[#FF8A3D] hover:underline">Open &rarr;</span>
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
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#303030] font-mono text-xs">
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
                          ? 'bg-[#151515] text-[#FF8A3D] border border-[#FF8A3D]/40 font-bold shadow-sm'
                          : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#151515]'
                      }`}
                    >
                      <span>{status.label}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                          selectedStatus === status.key
                            ? 'bg-[#FF8A3D] text-black font-bold'
                            : 'bg-[#1D1D1D] text-[#A6A09A]'
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
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search leads by name, email, company..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#151515] border border-[#303030] focus:border-[#FF8A3D] text-[#F5F1EB] placeholder-[#A6A09A] text-xs focus:outline-none transition-colors"
                  />
                  <Search className="w-4 h-4 text-[#A6A09A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </form>

                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-[#151515] border border-[#303030] text-[#F5F1EB] text-xs focus:outline-none focus:border-[#FF8A3D] cursor-pointer"
                    >
                      {SERVICES_LIST.map((srv) => (
                        <option key={srv} value={srv} className="bg-[#151515] text-[#F5F1EB]">
                          {srv}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#A6A09A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="px-3 py-2.5 rounded-xl bg-[#151515] border border-[#303030] text-[#A6A09A] hover:text-[#F5F1EB] text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#FF8A3D]" />
                    <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                  </button>
                </div>
              </div>

              {/* Data View */}
              {isLoading ? (
                <div className="p-16 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono text-xs text-[#A6A09A]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF8A3D] mb-3" />
                  Retrieving leads from Supabase database...
                </div>
              ) : leads.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono text-xs text-[#A6A09A]">
                  <Inbox className="w-10 h-10 mx-auto text-[#A6A09A] mb-3 opacity-60" />
                  <p className="text-sm font-bold text-[#F5F1EB]">No matching enquiries found</p>
                  <p className="mt-1 text-[#A6A09A]">
                    {search ? `No records matched search term "${search}".` : 'No leads match the selected filter criteria.'}
                  </p>
                </div>
              ) : viewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="rounded-2xl bg-[#151515] border border-[#303030] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#101010] text-[#A6A09A] border-b border-[#303030] uppercase text-[10px] tracking-wider">
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
                      <tbody className="divide-y divide-[#303030]">
                        {leads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-[#1D1D1D]/70 transition-colors cursor-pointer group"
                            onClick={() => openLeadDetail(lead)}
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#F5F1EB] group-hover:text-[#FF8A3D] transition-colors">
                                {lead.name}
                              </div>
                              {lead.company && (
                                <div className="text-[11px] text-[#A6A09A]">
                                  {lead.company}
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-[#F5F1EB] hover:text-[#FF8A3D] hover:underline"
                                >
                                  {lead.email}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(lead.email)}
                                  title="Copy Email"
                                  className="p-1 rounded text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#303030]"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-[#1D1D1D] border border-[#303030] text-[11px] text-[#F5F1EB]">
                                {lead.service || 'Web Platform'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-[11px]">
                              <div className="text-[#FF8A3D] font-medium">
                                {lead.budget || 'Unspecified'}
                              </div>
                              <div className="text-[#A6A09A]">
                                {lead.timeline || 'Flexible'}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-[11px] text-[#A6A09A]">
                              {formatDate(lead.created_at)}
                            </td>

                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <div className="relative inline-block">
                                <select
                                  value={lead.status}
                                  disabled={updatingStatusId === lead.id}
                                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                  className="appearance-none pl-2.5 pr-6 py-1 rounded-full text-[11px] font-mono font-medium uppercase tracking-wider bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] focus:border-[#FF8A3D] focus:outline-none cursor-pointer"
                                >
                                  <option value="new">● New</option>
                                  <option value="contacted">● Contacted</option>
                                  <option value="qualified">● Qualified</option>
                                  <option value="proposal_sent">● Proposal Sent</option>
                                  <option value="negotiation">● Negotiation</option>
                                  <option value="won">● Won</option>
                                  <option value="lost">● Lost</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-[#A6A09A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => openLeadDetail(lead)}
                                className="px-3 py-1 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#F5F1EB] text-[11px] hover:text-[#FF8A3D] transition-colors"
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
                      className="p-5 rounded-2xl bg-[#151515] border border-[#303030] hover:border-[#454545] transition-all flex flex-col justify-between font-mono text-xs cursor-pointer group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          {getStatusBadge(lead.status)}
                          <span className="text-[11px] text-[#A6A09A]">
                            {formatDate(lead.created_at)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#F5F1EB] group-hover:text-[#FF8A3D] transition-colors mb-0.5">
                          {lead.name}
                        </h4>
                        {lead.company && (
                          <p className="text-[11px] text-[#A6A09A] mb-2">{lead.company}</p>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="px-2 py-0.5 rounded bg-[#1D1D1D] border border-[#303030] text-[10px] text-[#F5F1EB]">
                            {lead.service || 'Web Platform'}
                          </span>
                          {lead.budget && (
                            <span className="px-2 py-0.5 rounded bg-[#FF8A3D]/10 border border-[#FF8A3D]/30 text-[10px] text-[#FF8A3D]">
                              {lead.budget}
                            </span>
                          )}
                        </div>

                        {lead.project_description && (
                          <p className="text-[11px] text-[#A6A09A] line-clamp-2 leading-relaxed bg-[#101010] p-2.5 rounded-xl border border-[#303030]/60 mb-4">
                            {lead.project_description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#303030] flex items-center justify-between">
                        <span className="text-[11px] text-[#A6A09A] truncate max-w-[150px]">
                          {lead.email}
                        </span>
                        <span className="text-[11px] text-[#FF8A3D] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Dossier</span>
                          <span>&rarr;</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between font-mono text-xs text-[#A6A09A] pt-2">
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
                      className="p-2 rounded-xl bg-[#151515] border border-[#303030] text-[#F5F1EB] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1D1D1D]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[#F5F1EB] px-2 font-bold">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadLeads(pagination.page + 1)}
                      className="p-2 rounded-xl bg-[#151515] border border-[#303030] text-[#F5F1EB] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1D1D1D]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: AUDIT REQUESTS TAB (Free Digital Audit Intakes)
             ========================================================================= */}
          {activeTab === 'audits' && (
            <ErrorBoundary title="Audit Requests View" onReset={loadAudits}>
              <div className="space-y-6">
                {/* Audit KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 font-mono">
                  <div className="p-4 rounded-2xl bg-[#151515] border border-[#303030]">
                    <p className="text-[10px] uppercase tracking-wider text-[#A6A09A]">Total Requests</p>
                    <p className="text-2xl font-bold text-[#F5F1EB] mt-1">{auditMetrics?.total || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#151515] border border-[#FF8A3D]/40 bg-[#FF8A3D]/5">
                    <p className="text-[10px] uppercase tracking-wider text-[#FF8A3D]">New / Pending</p>
                    <p className="text-2xl font-bold text-[#FF8A3D] mt-1">{auditMetrics?.new || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#151515] border border-[#303030]">
                    <p className="text-[10px] uppercase tracking-wider text-sky-400">In Progress</p>
                    <p className="text-2xl font-bold text-sky-400 mt-1">{auditMetrics?.in_progress || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#151515] border border-[#303030]">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400">Completed</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{auditMetrics?.completed || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#151515] border border-[#303030]">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">Rejected</p>
                    <p className="text-2xl font-bold text-zinc-400 mt-1">{auditMetrics?.rejected || 0}</p>
                  </div>
                </div>

                {/* Database Migration Pending Notice */}
                {auditMigrationPending && (
                  <div className="p-5 rounded-2xl bg-[#FF8A3D]/10 border border-[#FF8A3D]/40 text-xs font-mono text-[#F5F1EB] flex items-start gap-3.5">
                    <AlertCircle className="w-5 h-5 text-[#FF8A3D] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <p className="font-bold text-[#FF8A3D]">Supabase Table Initialization Required</p>
                      <p className="text-[#A6A09A] leading-relaxed">
                        The <code className="text-[#F5F1EB]">public.audit_requests</code> table has not been created in your Supabase project yet.
                        To activate persistent storage, open the Supabase SQL Editor and execute:
                      </p>
                      <code className="block p-2 rounded bg-black/60 border border-[#303030] text-[#FF8A3D] text-[11px]">
                        supabase/migrations/20261102_create_audit_requests_table.sql
                      </code>
                    </div>
                  </div>
                )}

                {/* Error Banner with Retry */}
                {auditsError && (
                  <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-[#F5F1EB] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-red-300">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                      <span>{auditsError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={loadAudits}
                      className="px-3 py-1.5 rounded-lg bg-[#FF8A3D] text-black font-bold text-xs uppercase whitespace-nowrap cursor-pointer hover:bg-[#E96D24]"
                    >
                      Retry Loading
                    </button>
                  </div>
                )}

                {/* Status Filter Pills & Search */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
                    {[
                      { key: 'all', label: 'All Requests', count: auditMetrics?.total },
                      { key: 'new', label: 'New', count: auditMetrics?.new },
                      { key: 'in_progress', label: 'In Progress', count: auditMetrics?.in_progress },
                      { key: 'completed', label: 'Completed', count: auditMetrics?.completed },
                      { key: 'rejected', label: 'Rejected', count: auditMetrics?.rejected },
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setSelectedAuditStatus(s.key)}
                        className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          selectedAuditStatus === s.key
                            ? 'bg-[#1D1D1D] text-[#FF8A3D] border border-[#FF8A3D]/40 font-bold'
                            : 'text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#151515]'
                        }`}
                      >
                        <span>{s.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#101010] text-[#A6A09A]">
                          {s.count || 0}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search audits..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#151515] border border-[#303030] text-xs font-mono text-[#F5F1EB] placeholder-[#A6A09A]/50 focus:outline-none focus:border-[#FF8A3D]"
                    />
                    <Globe className="w-3.5 h-3.5 text-[#A6A09A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Audits List */}
                {isAuditsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="p-6 rounded-2xl bg-[#151515] border border-[#303030] animate-pulse space-y-3 font-mono"
                      >
                        <div className="flex justify-between items-center">
                          <div className="h-4 w-40 bg-[#252525] rounded" />
                          <div className="h-4 w-20 bg-[#252525] rounded-full" />
                        </div>
                        <div className="h-12 bg-[#1D1D1D] rounded-xl" />
                        <div className="h-3 w-2/3 bg-[#252525] rounded" />
                      </div>
                    ))}
                  </div>
                ) : audits.length === 0 ? (
                  <div className="p-16 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono">
                    <Globe className="w-10 h-10 text-[#FF8A3D] mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-bold text-[#F5F1EB]">No Audit Requests Found</p>
                    <p className="text-xs text-[#A6A09A] mt-1">
                      {selectedAuditStatus !== 'all'
                        ? `No audit requests match the "${selectedAuditStatus}" filter.`
                        : 'Audit submissions through your website will appear here with instant review actions.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {audits.map((audit) => {
                      const statusBadgeColors = {
                        new: 'text-[#FF8A3D] bg-[#FF8A3D]/10 border-[#FF8A3D]/30',
                        in_progress: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
                        completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                        rejected: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',
                      }

                      const isEditingNotes = editingAuditNotesId === audit.id
                      const isConverting = auditConvertingId === audit.id

                      return (
                        <motion.div
                          key={audit.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 sm:p-6 rounded-2xl bg-[#151515] border border-[#303030] space-y-4 font-mono shadow-sm hover:border-[#3D3D3D] transition-all"
                        >
                          {/* Top Row: Prospect Details & Status */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2.5">
                                <h3
                                  onClick={() => setSelectedAudit(audit)}
                                  className="text-base font-bold text-[#F5F1EB] hover:text-[#FF8A3D] transition-colors cursor-pointer"
                                >
                                  {audit.full_name}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                    statusBadgeColors[audit.status] || 'text-[#A6A09A] border-[#303030]'
                                  }`}
                                >
                                  {(audit.status || 'new').replace('_', ' ')}
                                </span>
                                {audit.converted_lead_id && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 uppercase tracking-wider">
                                    Converted to CRM Lead
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-[#A6A09A]">
                                <a
                                  href={`mailto:${audit.work_email}`}
                                  className="hover:text-[#FF8A3D] transition-colors"
                                >
                                  {audit.work_email}
                                </a>
                                <span>&middot;</span>
                                <span>{formatDate(audit.created_at)}</span>
                              </div>
                            </div>

                            {/* Quick Status Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#A6A09A]">Status:</span>
                              <select
                                value={audit.status || 'new'}
                                onChange={(e) => handleAuditStatusChange(audit.id, e.target.value)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#1D1D1D] border border-[#303030] text-xs text-[#F5F1EB] focus:outline-none focus:border-[#FF8A3D] cursor-pointer"
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>

                          {/* Middle Row: Website URL & Focus */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#1D1D1D] border border-[#2B2B2B] text-xs">
                            <div>
                              <span className="text-[#8E8681] text-[10px] uppercase tracking-wider block mb-0.5">
                                Target Website
                              </span>
                              <a
                                href={audit.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#FF8A3D] hover:underline flex items-center gap-1.5 truncate"
                              >
                                <span>{audit.website_url}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                              </a>
                            </div>
                            <div>
                              <span className="text-[#8E8681] text-[10px] uppercase tracking-wider block mb-0.5">
                                Audit Focus Area
                              </span>
                              <span className="text-[#F5F1EB] font-semibold">{audit.audit_type}</span>
                            </div>
                          </div>

                          {/* Biggest Challenge Section */}
                          {audit.biggest_challenge && (
                            <div className="text-xs p-3.5 rounded-xl bg-[#101010] border border-[#262626] text-[#A6A09A]">
                              <span className="text-[10px] uppercase tracking-wider text-[#78736D] block mb-1 font-bold">
                                Reported Challenge / Goals:
                              </span>
                              <p className="text-[#F5F1EB] leading-relaxed whitespace-pre-wrap">
                                {audit.biggest_challenge}
                              </p>
                            </div>
                          )}

                          {/* Internal Notes Section */}
                          <div className="pt-2 border-t border-[#262626] text-xs">
                            {isEditingNotes ? (
                              <div className="space-y-2">
                                <textarea
                                  rows={2}
                                  value={auditNotesDraft}
                                  onChange={(e) => setAuditNotesDraft(e.target.value)}
                                  placeholder="Add private notes on evaluation findings, Lighthouse score, design issues..."
                                  className="w-full p-2.5 rounded-xl bg-[#1D1D1D] border border-[#303030] text-xs text-[#F5F1EB] placeholder-[#A6A09A]/40 focus:outline-none focus:border-[#FF8A3D] resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingAuditNotesId(null)}
                                    className="px-3 py-1 rounded-lg bg-[#252525] text-[#A6A09A] hover:text-[#F5F1EB]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAuditNotesSave(audit.id)}
                                    className="px-3 py-1 rounded-lg bg-[#FF8A3D] text-black font-bold"
                                  >
                                    Save Note
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="text-[#A6A09A] text-[11px] truncate flex-1 pr-4">
                                  {audit.admin_notes ? (
                                    <span>
                                      <strong className="text-[#F5F1EB]">Note:</strong> {audit.admin_notes}
                                    </span>
                                  ) : (
                                    <span className="italic text-[#78736D]">No internal notes recorded yet.</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAuditNotesId(audit.id)
                                    setAuditNotesDraft(audit.admin_notes || '')
                                  }}
                                  className="text-[11px] text-[#FF8A3D] hover:underline whitespace-nowrap cursor-pointer"
                                >
                                  {audit.admin_notes ? 'Edit Note' : '+ Add Note'}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-[#262626] flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedAudit(audit)}
                                className="px-3 py-1.5 rounded-lg bg-[#FF8A3D]/10 hover:bg-[#FF8A3D]/20 border border-[#FF8A3D]/30 text-xs font-bold text-[#FF8A3D] flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Dossier</span>
                              </button>
                              <a
                                href={audit.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-xs text-[#F5F1EB] flex items-center gap-1.5 transition-colors"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                <span>Website</span>
                              </a>
                              <a
                                href={`mailto:${audit.work_email}?subject=Northup%20Studio%20Free%20Digital%20Audit%20Findings&body=Hi%20${encodeURIComponent(
                                  audit.full_name
                                )},%0D%0A%0D%0AThank%20you%20for%20requesting%20a%20digital%20audit%20for%20${encodeURIComponent(
                                  audit.website_url
                                )}.%0D%0A%0D%0AHere%20are%20our%20initial%20findings:`}
                                className="px-3 py-1.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-xs text-[#F5F1EB] flex items-center gap-1.5 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Email</span>
                              </a>
                            </div>

                            {!audit.converted_lead_id && (
                              <button
                                type="button"
                                onClick={() => handleConvertAudit(audit.id)}
                                disabled={isConverting}
                                className="px-3.5 py-1.5 rounded-lg bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                              >
                                {isConverting ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Converting...</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Convert to CRM Lead</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            </ErrorBoundary>
          )}

          {/* =========================================================================
              VIEW C: CLIENTS TAB (Won / Converted Accounts)
             ========================================================================= */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Active Client Accounts &amp; Retainers
                </h2>
                <p className="text-xs font-mono text-[#A6A09A] mt-1">
                  Client engagements converted from won pipeline proposals.
                </p>
              </div>

              {wonClients.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono">
                  <Trophy className="w-10 h-10 text-[#FF8A3D] mx-auto mb-3 opacity-60" />
                  <p className="text-sm font-bold text-[#F5F1EB]">No Active Clients Yet</p>
                  <p className="text-xs text-[#A6A09A] mt-1">
                    Mark a lead as "Won" to convert them into an active client engagement.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  {wonClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => openLeadDetail(client)}
                      className="p-5 rounded-2xl bg-[#151515] border border-[#303030] hover:border-[#FF8A3D]/50 transition-all flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            ACTIVE CLIENT
                          </span>
                          <span className="text-[11px] text-[#A6A09A]">
                            Won: {formatDate(client.converted_at || client.created_at)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#F5F1EB] mb-0.5">
                          {client.name}
                        </h3>
                        {client.company && (
                          <p className="text-xs text-[#A6A09A] mb-2">{client.company}</p>
                        )}

                        <div className="p-3 rounded-xl bg-[#101010] border border-[#303030] space-y-1.5 my-3 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-[#A6A09A]">Service:</span>
                            <span className="text-[#F5F1EB]">{client.service}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A6A09A]">Budget Scope:</span>
                            <span className="text-[#FF8A3D] font-bold">{client.budget || 'Custom'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#303030] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openLeadDetail(client)
                            openCommunicationModal('project_accepted')
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FF8A3D]/10 hover:bg-[#FF8A3D]/20 text-[#FF8A3D] text-[10px] font-bold"
                        >
                          Client Actions ↗
                        </button>
                        <span className="text-[11px] text-[#A6A09A]">Open Dossier &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW D: PROPOSALS HUB TAB (Phase H)
             ========================================================================= */}
          {activeTab === 'proposals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                    Proposals &amp; Scope Documents
                  </h2>
                  <p className="text-xs font-mono text-[#A6A09A] mt-1">
                    Bespoke agency proposals, milestone schedules, and itemized contracts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!leads.length) {
                      alert('You must have at least one lead to generate a proposal.')
                      return
                    }
                    if (!selectedLead) setSelectedLead(leads[0])
                    setProposalTitle(selectedLead?.service ? `${selectedLead.service} Proposal` : 'Digital Experience Platform')
                    setProposalOverview(`Comprehensive design engineering engagement for ${selectedLead?.company || selectedLead?.name || 'Client'}.`)
                    setProposalModalOpen(true)
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft New Proposal</span>
                </button>
              </div>

              {leadProposals.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono">
                  <FileSignature className="w-10 h-10 text-[#FF8A3D] mx-auto mb-3 opacity-60" />
                  <p className="text-sm font-bold text-[#F5F1EB]">No Active Proposals Found</p>
                  <p className="text-xs text-[#A6A09A] mt-1 max-w-sm mx-auto">
                    Draft a bespoke proposal for any client in your pipeline with itemized scope, deliverables, and payment terms.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  {leadProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-5 rounded-2xl bg-[#151515] border border-[#303030] flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-[#FF8A3D] tracking-widest">
                            {prop.proposal_number}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1D1D1D] text-[#A6A09A] border border-[#303030]">
                            {prop.status}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#F5F1EB] mb-1">
                          {prop.title}
                        </h3>
                        <p className="text-[11px] text-[#A6A09A] mb-3">
                          Client: {prop.client_name} {prop.client_company ? `(${prop.client_company})` : ''}
                        </p>

                        <div className="p-3 rounded-xl bg-[#101010] border border-[#303030] space-y-1 my-3 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-[#A6A09A]">Investment Total:</span>
                            <span className="text-[#FF8A3D] font-bold">${prop.total_amount || 0} {prop.currency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A6A09A]">Valid Until:</span>
                            <span className="text-[#F5F1EB]">{prop.valid_until || '14 Days'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#303030] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProposalToView(prop)}
                          className="flex-1 py-1.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#F5F1EB] text-[11px] transition-colors"
                        >
                          View Document ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW E: TASKS & FOLLOW-UP QUEUE (Phase I)
             ========================================================================= */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Follow-up Queue &amp; Lead Deadlines
                </h2>
                <p className="text-xs font-mono text-[#A6A09A] mt-1">
                  Active client consultations requiring follow-up, proposal submissions, or onboarding.
                </p>
              </div>

              {followUpLeads.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#151515] border border-[#303030] text-center font-mono">
                  <ShieldCheck className="w-12 h-12 text-[#FF8A3D] mx-auto mb-3 opacity-90" />
                  <h3 className="text-base font-bold text-[#F5F1EB]">All Follow-ups Complete</h3>
                  <p className="text-xs text-[#A6A09A] max-w-md mx-auto mt-1 leading-relaxed">
                    No active inquiries currently require follow-up. All client inquiries have been addressed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {followUpLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl bg-[#151515] border border-[#303030] hover:border-[#454545] transition-all flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          {getStatusBadge(lead.status)}
                          <span className="text-[11px] text-[#A6A09A]">
                            Received: {formatDate(lead.created_at)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#F5F1EB] mb-0.5">
                          {lead.name}
                        </h4>
                        {lead.company && (
                          <p className="text-[11px] text-[#A6A09A] mb-2">{lead.company}</p>
                        )}

                        <div className="p-3 rounded-xl bg-[#101010] border border-[#303030] space-y-1.5 text-[11px] my-3">
                          <div className="flex justify-between">
                            <span className="text-[#A6A09A]">Service:</span>
                            <span className="text-[#F5F1EB]">{lead.service}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A6A09A]">Budget:</span>
                            <span className="text-[#FF8A3D]">{lead.budget || 'Flexible'}</span>
                          </div>
                          {lead.next_follow_up_date && (
                            <div className="flex justify-between pt-1 border-t border-[#303030]">
                              <span className="text-[#FF8A3D]">Scheduled Date:</span>
                              <span className="text-[#F5F1EB] font-bold">{formatDate(lead.next_follow_up_date)}</span>
                            </div>
                          )}
                        </div>

                        {lead.project_description && (
                          <p className="text-[11px] text-[#A6A09A] line-clamp-2 leading-relaxed mb-4">
                            "{lead.project_description}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#303030] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLead(lead)
                            openCommunicationModal('polite_followup')
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#FF8A3D] text-[11px] font-bold transition-colors"
                        >
                          Send Follow-up ↗
                        </button>

                        <button
                          type="button"
                          onClick={() => openLeadDetail(lead)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold text-[11px] transition-colors"
                        >
                          Open Dossier ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW F: TEMPLATES CENTER TAB (Phase C)
             ========================================================================= */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Client Communication Template Center
                </h2>
                <p className="text-xs font-mono text-[#A6A09A] mt-1">
                  14 agency message templates with variable interpolation for Email and WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                {templatesList.map((tpl) => (
                  <div
                    key={tpl.key}
                    className="p-5 rounded-2xl bg-[#151515] border border-[#303030] flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF8A3D]/15 text-[#FF8A3D] border border-[#FF8A3D]/30">
                          {tpl.category}
                        </span>
                        <span className="text-[10px] text-[#A6A09A]">
                          {tpl.variables?.length || 0} variables
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#F5F1EB] mb-1.5">
                        {tpl.title}
                      </h3>
                      {tpl.subject && (
                        <p className="text-[11px] text-[#A6A09A] line-clamp-1 mb-3">
                          Subj: {tpl.subject}
                        </p>
                      )}

                      <div className="p-3 rounded-xl bg-[#101010] border border-[#303030] text-[11px] text-[#A6A09A] line-clamp-4 leading-relaxed mb-4 whitespace-pre-wrap">
                        {tpl.body_email}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#303030] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTemplateKey(tpl.key)
                          setEditingTemplateData({ ...tpl })
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#F5F1EB] text-[11px]"
                      >
                        Edit Wording
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (leads.length) {
                            setSelectedLead(leads[0])
                            openCommunicationModal(tpl.key)
                          } else {
                            alert('No leads available to test template.')
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FF8A3D] text-black font-bold text-[11px]"
                      >
                        Test / Send ↗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW G: PROJECTS / CASE STUDIES TAB
             ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Studio Production Monographs
                </h2>
                <p className="text-xs font-mono text-[#A6A09A] mt-1">
                  Verified original client projects and public portfolio case studies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
                {STUDIO_PROJECTS.map((proj) => (
                  <div
                    key={proj.route}
                    className="p-5 rounded-2xl bg-[#151515] border border-[#303030] flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF8A3D]/15 text-[#FF8A3D] border border-[#FF8A3D]/30">
                          {proj.tag}
                        </span>
                        <span className="text-[10px] text-[#A6A09A]">{proj.category}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#F5F1EB] mb-1.5">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[#A6A09A] leading-relaxed mb-4">
                        {proj.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(proj.route)}
                      className="w-full py-2.5 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#F5F1EB] hover:text-[#FF8A3D] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
              VIEW H: SETTINGS & INTEGRATIONS TAB (Phase E, F, G)
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl font-mono text-xs">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Integrations &amp; Channel Status
                </h2>
                <p className="text-[#A6A09A] mt-1">
                  Active server credentials, external APIs, and communication gateways.
                </p>
              </div>

              {/* Resend Email Status */}
              <div className="p-5 rounded-2xl bg-[#151515] border border-[#303030] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FF8A3D]" />
                    <h3 className="text-xs font-bold uppercase text-[#F5F1EB]">Resend Email Delivery</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    CONFIGURED &amp; ACTIVE
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#A6A09A]">Notification Recipient:</span>
                    <span className="text-[#F5F1EB]">northup4work@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A09A]">Sender Address:</span>
                    <span className="text-[#F5F1EB]">Northup Studio &lt;onboarding@resend.dev&gt;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6A09A]">HTML Template Style:</span>
                    <span className="text-[#FF8A3D]">Dark Charcoal &amp; Brand Orange</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Cloud API Status (Phase F) */}
              <div className="p-5 rounded-2xl bg-[#151515] border border-[#303030] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase text-[#F5F1EB]">WhatsApp Business Cloud API</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    MANUAL FALLBACK ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#A6A09A] leading-relaxed">
                  To enable direct automated WhatsApp delivery via Meta's Cloud API, configure these Vercel environment variables:
                </p>
                <div className="p-3.5 rounded-xl bg-[#101010] border border-[#303030] space-y-1 font-mono text-[11px] text-[#A6A09A]">
                  <div>&bull; <code className="text-[#F5F1EB]">WHATSAPP_ACCESS_TOKEN</code> (Meta System User Token)</div>
                  <div>&bull; <code className="text-[#F5F1EB]">WHATSAPP_PHONE_NUMBER_ID</code> (Business Phone ID)</div>
                  <div>&bull; <code className="text-[#F5F1EB]">WHATSAPP_BUSINESS_ACCOUNT_ID</code> (Meta WABA ID)</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                  ✓ <strong>1-Click Fallback Ready:</strong> You can already send pre-filled WhatsApp messages to any client directly using the "Open in WhatsApp" button in the lead dossier.
                </div>
              </div>

              {/* Google Meet & Calendar Status (Phase G) */}
              <div className="p-5 rounded-2xl bg-[#151515] border border-[#303030] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs font-bold uppercase text-[#F5F1EB]">Google Calendar &amp; Meet</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    MANUAL LINK ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#A6A09A] leading-relaxed">
                  For automated calendar invite creation, provide Google OAuth credentials (<code className="text-[#F5F1EB]">GOOGLE_CLIENT_ID</code>, <code className="text-[#F5F1EB]">GOOGLE_CLIENT_SECRET</code>, <code className="text-[#F5F1EB]">GOOGLE_REFRESH_TOKEN</code>).
                </p>
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300">
                  ✓ <strong>Instant Scheduling:</strong> You can schedule meetings with clients right now by pasting your personal Google Meet room link or using the default room generator.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          3. RIGHT-SIDE CONTEXTUAL CLIENT DETAIL DRAWER (Phase B & D)
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
                className="w-screen max-w-xl bg-[#151515] border-l border-[#303030] flex flex-col shadow-2xl text-[#F5F1EB] overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-[#303030] flex items-center justify-between bg-[#121212]">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#FF8A3D] uppercase">
                      CLIENT DOSSIER
                    </span>
                    <h2 className="text-lg font-bold text-[#F5F1EB] mt-0.5 truncate max-w-xs sm:max-w-md">
                      {selectedLead.name}
                    </h2>
                    {selectedLead.company && (
                      <p className="text-xs text-[#A6A09A]">{selectedLead.company}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openCommunicationModal('discovery_invitation')}
                      className="px-3 py-1.5 rounded-xl bg-[#FF8A3D] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#E96D24] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Client Message</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedLead(null)}
                      className="p-2 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] text-[#A6A09A] hover:text-[#F5F1EB]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                  {/* Phase D: Client Quick Actions Hub */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8A3D] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Client Actions Hub</span>
                      </span>
                      <span className="text-[10px] text-[#A6A09A]">Email &amp; WhatsApp</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => openCommunicationModal('personal_welcome')}
                        className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-[#FF8A3D]/40 transition-colors"
                      >
                        <div className="font-bold text-[#F5F1EB]">Welcome</div>
                        <div className="text-[10px] text-[#A6A09A]">Intro email</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProposalTitle(`${selectedLead.service || 'Web Platform'} Proposal`)
                          setProposalOverview(`Bespoke architecture and development for ${selectedLead.company || selectedLead.name}.`)
                          setProposalModalOpen(true)
                        }}
                        className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-[#FF8A3D]/40 transition-colors"
                      >
                        <div className="font-bold text-[#F5F1EB]">Proposal</div>
                        <div className="text-[10px] text-[#A6A09A]">Draft &amp; send</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMeetingModalOpen(true)}
                        className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-[#FF8A3D]/40 transition-colors"
                      >
                        <div className="font-bold text-[#F5F1EB]">Schedule</div>
                        <div className="text-[10px] text-[#A6A09A]">Google Meet</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCommunicationModal('polite_followup')}
                        className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-[#FF8A3D]/40 transition-colors"
                      >
                        <div className="font-bold text-[#F5F1EB]">Follow-up</div>
                        <div className="text-[10px] text-[#A6A09A]">Check in</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCommunicationModal('project_accepted')}
                        className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-[#FF8A3D]/40 transition-colors"
                      >
                        <div className="font-bold text-[#F5F1EB]">Onboard</div>
                        <div className="text-[10px] text-[#A6A09A]">Next steps</div>
                      </button>

                      {selectedLead.phone ? (
                        <a
                          href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedLead.name)},%20reaching%20out%20from%20Northup%20Studio%20regarding%20your%20project.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-emerald-500/40 transition-colors block"
                        >
                          <div className="font-bold text-emerald-400">WhatsApp</div>
                          <div className="text-[10px] text-[#A6A09A]">Open chat ↗</div>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const p = prompt('Enter WhatsApp phone number with country code (e.g. +14155552671):')
                            if (p) {
                              updateLeadCRM(selectedLead.id, { phone: p })
                              setSelectedLead((prev) => ({ ...prev, phone: p }))
                              showNotification('Phone saved.')
                            }
                          }}
                          className="p-2.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-left hover:border-emerald-500/40 transition-colors"
                        >
                          <div className="font-bold text-[#A6A09A]">+ Add Phone</div>
                          <div className="text-[10px] text-[#A6A09A]">For WhatsApp</div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stage Selector */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#A6A09A] font-bold uppercase tracking-wider text-[11px]">
                        Pipeline Stage:
                      </span>
                      {getStatusBadge(selectedLead.status)}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      {['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(selectedLead.id, st)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                            selectedLead.status === st
                              ? 'bg-[#FF8A3D] text-black border-[#FF8A3D]'
                              : 'bg-[#151515] text-[#A6A09A] border-[#303030] hover:text-[#F5F1EB]'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Convert Won Lead to Client button */}
                    {selectedLead.status === 'won' && !selectedLead.converted_at && (
                      <div className="mt-3 pt-3 border-t border-[#303030]">
                        <button
                          type="button"
                          onClick={() => handleConvertLeadToClient(selectedLead)}
                          className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Convert to Active Client Engagement</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Next Follow-up Date */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] flex items-center justify-between">
                    <div>
                      <span className="text-[#A6A09A] text-[11px]">Scheduled Follow-up:</span>
                      <p className="font-bold text-[#F5F1EB]">
                        {selectedLead.next_follow_up_date ? formatDate(selectedLead.next_follow_up_date) : 'No follow-up set'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {editingFollowUp ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="date"
                            value={followUpInput}
                            onChange={(e) => setFollowUpInput(e.target.value)}
                            className="bg-[#151515] border border-[#303030] text-[#F5F1EB] p-1.5 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleSaveFollowUpDate}
                            className="px-2 py-1.5 rounded-lg bg-[#FF8A3D] text-black font-bold text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingFollowUp(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#151515] hover:bg-[#252525] border border-[#303030] text-xs text-[#FF8A3D]"
                        >
                          {selectedLead.next_follow_up_date ? 'Reschedule' : 'Set Date'}
                        </button>
                      )}

                      {selectedLead.next_follow_up_date && (
                        <button
                          type="button"
                          onClick={handleToggleFollowUpCompleted}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                            selectedLead.follow_up_completed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-[#151515] text-[#A6A09A] border-[#303030]'
                          }`}
                        >
                          {selectedLead.follow_up_completed ? 'Completed ✓' : 'Mark Done'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Client Details Grid */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
                      <span className="text-[#A6A09A]">Work Email:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#F5F1EB] font-bold">{selectedLead.email}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedLead.email)}
                          className="p-1 rounded text-[#A6A09A] hover:text-[#F5F1EB]"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
                      <span className="text-[#A6A09A]">Phone / WhatsApp:</span>
                      <span className="text-[#F5F1EB] font-bold">{selectedLead.phone || 'Not supplied'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
                      <span className="text-[#A6A09A]">Service Requested:</span>
                      <span className="text-[#FF8A3D] font-bold">{selectedLead.service || 'Web Platform'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
                      <span className="text-[#A6A09A]">Estimated Budget:</span>
                      <span className="text-[#F5F1EB] font-bold">{selectedLead.budget || 'Flexible'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
                      <span className="text-[#A6A09A]">Desired Timeline:</span>
                      <span className="text-[#F5F1EB] font-bold">{selectedLead.timeline || 'Flexible'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#A6A09A]">Received At:</span>
                      <span className="text-[#A6A09A]">{formatDate(selectedLead.created_at)}</span>
                    </div>
                  </div>

                  {/* Enquiry Message */}
                  <div>
                    <h3 className="text-[11px] font-bold text-[#A6A09A] uppercase tracking-wider mb-2">
                      Enquiry Scope &amp; Message:
                    </h3>
                    <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] text-xs leading-relaxed text-[#F5F1EB] whitespace-pre-wrap">
                      {selectedLead.project_description || 'No additional scope notes provided.'}
                    </div>
                  </div>

                  {/* Communication History Timeline */}
                  <div className="pt-2 border-t border-[#303030] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold text-[#FF8A3D] uppercase tracking-wider flex items-center gap-1.5">
                        <SendHorizontal className="w-3.5 h-3.5" />
                        <span>Communication History</span>
                      </h3>
                      <span className="text-[10px] text-[#A6A09A]">
                        {commLogs.length} events
                      </span>
                    </div>

                    {isLoadingComm ? (
                      <div className="py-4 text-center text-[#A6A09A]">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#FF8A3D] mb-1" />
                        Loading communication history...
                      </div>
                    ) : commLogs.length === 0 ? (
                      <div className="p-3.5 rounded-xl bg-[#1D1D1D] border border-[#303030] text-center text-[#A6A09A] text-[11px]">
                        No client communication dispatched yet. Use "Client Actions Hub" above to send initial outreach.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {commLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-[#FF8A3D] uppercase">
                                [{log.channel}] {log.subject || 'Message'}
                              </span>
                              <span className="text-[#A6A09A]">{formatDate(log.created_at)}</span>
                            </div>
                            <p className="text-[11px] text-[#D6D0C7] line-clamp-2 leading-relaxed">
                              {log.content}
                            </p>
                            <div className="flex items-center justify-between pt-1 text-[10px] text-[#A6A09A]">
                              <span>To: {log.recipient}</span>
                              <span className="uppercase text-emerald-400 font-bold">{log.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Private Internal Notes */}
                  <div className="pt-2 border-t border-[#303030] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold text-[#F5F1EB] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#FF8A3D]" />
                        <span>Private Internal Notes</span>
                      </h3>
                      <span className="text-[10px] text-[#A6A09A]">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                      </span>
                    </div>

                    <form onSubmit={handleCreateNote} className="space-y-2">
                      <textarea
                        rows={3}
                        maxLength={3000}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add private team notes, call takeaways, or deal scopes..."
                        className="w-full p-3 rounded-xl bg-[#1D1D1D] border border-[#303030] focus:border-[#FF8A3D] text-[#F5F1EB] placeholder-[#A6A09A] text-xs focus:outline-none transition-colors"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#A6A09A]">
                          {newNote.length}/3000
                        </span>
                        <button
                          type="submit"
                          disabled={isAddingNote || !newNote.trim()}
                          className="px-3.5 py-1.5 rounded-lg bg-[#FF8A3D] hover:bg-[#E96D24] disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {isAddingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>Add Note</span>
                        </button>
                      </div>
                    </form>

                    {isLoadingNotes ? (
                      <div className="py-6 text-center text-[#A6A09A]">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#FF8A3D] mb-2" />
                        Loading internal notes...
                      </div>
                    ) : notes.length === 0 ? (
                      <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] text-center text-[#A6A09A] text-[11px]">
                        No internal notes recorded yet.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3.5 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#A6A09A]">
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
                            <p className="text-xs text-[#F5F1EB] whitespace-pre-wrap leading-relaxed">
                              {note.content || note.note}
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

      {/* =========================================================================
          4. CLIENT COMMUNICATION & TEMPLATE MODAL (Phase D & E & F)
         ========================================================================= */}
      <AnimatePresence>
        {commModalOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#151515] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-xs max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#303030] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#FF8A3D] uppercase tracking-wider">
                    ONE-CLICK COMMUNICATION
                  </span>
                  <h3 className="text-base font-bold text-[#F5F1EB]">
                    Message to {selectedLead.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCommModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Template Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#A6A09A] uppercase mb-1.5">
                  Select Template:
                </label>
                <div className="relative">
                  <select
                    value={selectedTemplateKey}
                    onChange={(e) => handleTemplateSelectionChange(e.target.value)}
                    className="w-full appearance-none bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2.5 rounded-xl text-xs focus:border-[#FF8A3D] focus:outline-none"
                  >
                    {templatesList.map((t) => (
                      <option key={t.key} value={t.key}>
                        [{t.category}] {t.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#A6A09A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Channel Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-[#A6A09A] uppercase mb-1.5">
                  Delivery Channel:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCommChannel('email')
                      handleTemplateSelectionChange(selectedTemplateKey)
                    }}
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-2 font-bold ${
                      commChannel === 'email'
                        ? 'bg-[#FF8A3D] text-black border-[#FF8A3D]'
                        : 'bg-[#1D1D1D] text-[#A6A09A] border-[#303030]'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Branded Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCommChannel('whatsapp')
                      handleTemplateSelectionChange(selectedTemplateKey)
                    }}
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-2 font-bold ${
                      commChannel === 'whatsapp'
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'bg-[#1D1D1D] text-[#A6A09A] border-[#303030]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Recipient Email:</label>
                  <input
                    type="email"
                    value={commRecipientEmail}
                    onChange={(e) => setCommRecipientEmail(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Recipient Phone (WhatsApp):</label>
                  <input
                    type="text"
                    placeholder="+14155552671"
                    value={commRecipientPhone}
                    onChange={(e) => setCommRecipientPhone(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Subject (for Email) */}
              {commChannel !== 'whatsapp' && (
                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Subject Line:</label>
                  <input
                    type="text"
                    value={commSubject}
                    onChange={(e) => setCommSubject(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                  />
                </div>
              )}

              {/* Editable Message Content */}
              <div>
                <label className="block text-[10px] text-[#A6A09A] mb-1">Personalized Message Content:</label>
                <textarea
                  rows={6}
                  value={commContent}
                  onChange={(e) => setCommContent(e.target.value)}
                  className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-3 rounded-xl text-xs leading-relaxed focus:border-[#FF8A3D] focus:outline-none"
                />
              </div>

              {/* Final Confirmation Banner */}
              <div className="p-3.5 rounded-xl bg-[#1D1D1D] border border-[#303030] text-[11px] text-[#A6A09A] space-y-1">
                <div>Recipient: <strong className="text-[#F5F1EB]">{commChannel === 'whatsapp' ? commRecipientPhone || 'No phone set' : commRecipientEmail}</strong></div>
                <div>Provider: <strong className="text-[#FF8A3D]">{commChannel === 'whatsapp' ? 'WhatsApp Cloud API / 1-Click Fallback' : 'Resend Transactional Engine'}</strong></div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#303030]">
                <button
                  type="button"
                  onClick={() => setCommModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] text-[#A6A09A] hover:text-[#F5F1EB]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSendingComm}
                  onClick={handleSendCommunication}
                  className="px-5 py-2.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSendingComm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Confirm &amp; Send Message</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          5. PROPOSAL BUILDER MODAL (Phase H)
         ========================================================================= */}
      <AnimatePresence>
        {proposalModalOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProposalModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-[#151515] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-xs max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#303030] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#FF8A3D] uppercase tracking-wider">
                    BESPOKE PROPOSAL BUILDER
                  </span>
                  <h3 className="text-base font-bold text-[#F5F1EB]">
                    Draft Scope Document for {selectedLead.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setProposalModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#A6A09A] hover:text-[#F5F1EB] hover:bg-[#1D1D1D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProposalSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Proposal Title:</label>
                  <input
                    type="text"
                    required
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Executive Scope &amp; Overview:</label>
                  <textarea
                    rows={3}
                    value={proposalOverview}
                    onChange={(e) => setProposalOverview(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2.5 rounded-xl text-xs"
                  />
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#A6A09A] uppercase">
                      Itemized Scope &amp; Pricing:
                    </span>
                    <button
                      type="button"
                      onClick={() => setProposalLineItems([...proposalLineItems, { description: 'Additional Scope', amount: 1000 }])}
                      className="text-[#FF8A3D] hover:underline text-[10px]"
                    >
                      + Add Item
                    </button>
                  </div>

                  {proposalLineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...proposalLineItems]
                          updated[idx].description = e.target.value
                          setProposalLineItems(updated)
                        }}
                        className="flex-1 bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => {
                          const updated = [...proposalLineItems]
                          updated[idx].amount = Number(e.target.value)
                          setProposalLineItems(updated)
                        }}
                        className="w-24 bg-[#1D1D1D] border border-[#303030] text-[#FF8A3D] font-bold p-2 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setProposalLineItems(proposalLineItems.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="p-3 rounded-xl bg-[#101010] border border-[#303030] flex justify-between font-bold text-xs">
                    <span>Total Investment:</span>
                    <span className="text-[#FF8A3D]">
                      ${proposalLineItems.reduce((acc, i) => acc + (Number(i.amount) || 0), 0)} {proposalCurrency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Payment Schedule &amp; Terms:</label>
                  <input
                    type="text"
                    value={proposalTerms}
                    onChange={(e) => setProposalTerms(e.target.value)}
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#303030]">
                  <button
                    type="button"
                    onClick={() => setProposalModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] text-[#A6A09A] hover:text-[#F5F1EB]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isCreatingProposal}
                    className="px-5 py-2.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold flex items-center gap-2 cursor-pointer"
                  >
                    {isCreatingProposal ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                    <span>Save &amp; Generate Proposal</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          6. DISCOVERY MEETING SCHEDULER MODAL (Phase G)
         ========================================================================= */}
      <AnimatePresence>
        {meetingModalOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMeetingModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#151515] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#303030] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#FF8A3D] uppercase">
                    GOOGLE MEET &amp; CALENDAR SCHEDULER
                  </span>
                  <h3 className="text-base font-bold text-[#F5F1EB]">
                    Schedule Consultation with {selectedLead.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMeetingModalOpen(false)}
                  className="p-1 rounded text-[#A6A09A] hover:text-[#F5F1EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleMeetingSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#A6A09A] mb-1">Date:</label>
                    <input
                      type="date"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#A6A09A] mb-1">Time (UTC):</label>
                    <input
                      type="time"
                      required
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full bg-[#1D1D1D] border border-[#303030] text-[#F5F1EB] p-2 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#A6A09A] mb-1">Google Meet / Video Conference URL:</label>
                  <input
                    type="url"
                    value={manualMeetLink}
                    onChange={(e) => setManualMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="w-full bg-[#1D1D1D] border border-[#303030] text-[#FF8A3D] p-2 rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-[#A6A09A] mt-1">
                    Paste your personal Google Meet room link or keep default to generate on the fly.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#303030]">
                  <button
                    type="button"
                    onClick={() => setMeetingModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1D1D1D] text-[#A6A09A] hover:text-[#F5F1EB]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSchedulingMeeting}
                    className="px-5 py-2.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold flex items-center gap-1.5"
                  >
                    {isSchedulingMeeting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                    <span>Confirm &amp; Log Meeting</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          7. PROPOSAL PREVIEW MODAL
         ========================================================================= */}
      <AnimatePresence>
        {selectedProposalToView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProposalToView(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#151515] border border-[#303030] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-xs max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#303030] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#FF8A3D] uppercase">
                    PROPOSAL DOCUMENT #{selectedProposalToView.proposal_number}
                  </span>
                  <h3 className="text-base font-bold text-[#F5F1EB] mt-0.5">
                    {selectedProposalToView.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProposalToView(null)}
                  className="p-1 rounded text-[#A6A09A] hover:text-[#F5F1EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#A6A09A]">Client Name:</span>
                  <span className="text-[#F5F1EB] font-bold">{selectedProposalToView.client_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A09A]">Client Email:</span>
                  <span className="text-[#F5F1EB]">{selectedProposalToView.client_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A09A]">Status:</span>
                  <span className="text-[#FF8A3D] uppercase font-bold">{selectedProposalToView.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6A09A]">Investment Total:</span>
                  <span className="text-[#FF8A3D] font-bold text-sm">${selectedProposalToView.total_amount} {selectedProposalToView.currency}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#A6A09A] uppercase mb-1.5">Scope Overview:</h4>
                <p className="p-3 rounded-xl bg-[#101010] border border-[#303030] text-[#F5F1EB] leading-relaxed">
                  {selectedProposalToView.project_overview || 'Bespoke design direction and full-stack engineering.'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#A6A09A] uppercase mb-1.5">Itemized Deliverables:</h4>
                <div className="space-y-1.5">
                  {(selectedProposalToView.deliverables || []).map((del, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[#101010] border border-[#303030] flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF8A3D]" />
                      <span className="text-[#F5F1EB]">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#303030] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProposalToView(null)}
                  className="px-4 py-2 rounded-xl bg-[#1D1D1D] text-[#A6A09A] hover:text-[#F5F1EB]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right-Side Slide-Over Audit Dossier Drawer */}
      <AnimatePresence>
        {selectedAudit && (
          <div className="fixed inset-0 z-50 overflow-hidden font-mono select-text">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAudit(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity cursor-pointer"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-lg bg-[#151515] border-l border-[#303030] shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-[#303030] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#FF8A3D] font-bold block mb-1">
                      Audit Request Dossier
                    </span>
                    <h2 className="text-lg font-bold text-[#F5F1EB]">{selectedAudit.full_name}</h2>
                    <p className="text-xs text-[#A6A09A] mt-0.5">{selectedAudit.work_email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAudit(null)}
                    className="p-2 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#A6A09A] hover:text-[#F5F1EB] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                  {/* Status Selection */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#A6A09A] font-bold uppercase tracking-wider text-[11px]">
                        Lifecycle Status:
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/30">
                        {(selectedAudit.status || 'new').replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {['new', 'in_progress', 'completed', 'rejected'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleAuditStatusChange(selectedAudit.id, st)}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                            selectedAudit.status === st
                              ? 'bg-[#FF8A3D] text-black border-[#FF8A3D]'
                              : 'bg-[#151515] text-[#A6A09A] border-[#303030] hover:text-[#F5F1EB]'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Website */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#A6A09A] block">
                      Target Website URL
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={selectedAudit.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#FF8A3D] hover:underline truncate"
                      >
                        {selectedAudit.website_url}
                      </a>
                      <a
                        href={selectedAudit.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#252525] hover:bg-[#303030] text-[#F5F1EB] transition-colors"
                        title="Open Website"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Audit Focus Area */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030]">
                    <span className="text-[10px] uppercase tracking-wider text-[#A6A09A] block mb-1">
                      Audit Focus Area
                    </span>
                    <p className="text-sm font-semibold text-[#F5F1EB]">{selectedAudit.audit_type}</p>
                  </div>

                  {/* Reported Challenge / Goals */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#A6A09A] block">
                      Client Goals &amp; Reported Challenge
                    </span>
                    <p className="text-xs text-[#F5F1EB] leading-relaxed whitespace-pre-wrap">
                      {selectedAudit.biggest_challenge || 'No challenge description provided.'}
                    </p>
                  </div>

                  {/* Submission Metadata */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#A6A09A]">
                      <span>Submitted Date:</span>
                      <span className="text-[#F5F1EB] font-bold">{formatDate(selectedAudit.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#A6A09A]">
                      <span>Intake Source:</span>
                      <span className="text-[#F5F1EB]">{selectedAudit.source || 'Website Hero Audit'}</span>
                    </div>
                    {selectedAudit.converted_lead_id && (
                      <div className="flex justify-between items-center text-purple-400 pt-2 border-t border-[#303030]">
                        <span>Conversion Link:</span>
                        <span className="font-bold">Lead ID: {selectedAudit.converted_lead_id.slice(0, 8)}...</span>
                      </div>
                    )}
                  </div>

                  {/* Internal Review Notes */}
                  <div className="p-4 rounded-xl bg-[#1D1D1D] border border-[#303030] space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#A6A09A] font-bold block">
                      Internal Studio Review Notes
                    </span>
                    <textarea
                      rows={3}
                      value={selectedAudit.admin_notes || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedAudit((prev) => (prev ? { ...prev, admin_notes: val } : null))
                      }}
                      placeholder="Record Lighthouse performance metrics, responsive layout defects, conversion issues..."
                      className="w-full p-3 rounded-xl bg-[#151515] border border-[#303030] text-xs text-[#F5F1EB] placeholder-[#A6A09A]/40 focus:outline-none focus:border-[#FF8A3D] resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleAuditNotesSave(selectedAudit.id, selectedAudit.admin_notes || '')}
                        className="px-4 py-1.5 rounded-lg bg-[#FF8A3D] text-black font-bold text-xs uppercase cursor-pointer hover:bg-[#E96D24]"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[#303030] bg-[#101010] flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${selectedAudit.work_email}?subject=Northup%20Studio%20Free%20Digital%20Audit%20Findings&body=Hi%20${encodeURIComponent(
                      selectedAudit.full_name
                    )},%0D%0A%0D%0AThank%20you%20for%20requesting%20a%20digital%20audit%20for%20${encodeURIComponent(
                      selectedAudit.website_url
                    )}.%0D%0A%0D%0AHere%20are%20our%20initial%20findings:`}
                    className="flex-1 py-3 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-xs font-bold text-[#F5F1EB] text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Findings</span>
                  </a>

                  {!selectedAudit.converted_lead_id && (
                    <button
                      type="button"
                      onClick={() => handleConvertAudit(selectedAudit.id)}
                      disabled={auditConvertingId === selectedAudit.id}
                      className="flex-1 py-3 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {auditConvertingId === selectedAudit.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Converting...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Convert to Lead</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
