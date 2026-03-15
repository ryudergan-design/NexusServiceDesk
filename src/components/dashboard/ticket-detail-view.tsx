"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Clock, 
  User, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  ChevronRight,
  MoreVertical,
  Paperclip,
  Lock,
  History,
  Send,
  ShieldCheck,
  DollarSign,
  XCircle,
  AlertTriangle,
  Star,
  UserPlus,
  Zap,
  MoreHorizontal,
  Calendar,
  ChevronDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { RichTextRenderer } from "@/components/rich-text-renderer"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { SatisfactionSurvey } from "@/components/dashboard/satisfaction-survey"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { AIInsightCard } from "@/components/ai/AIInsightCard"
import { MagicCompose } from "@/components/ai/MagicCompose"
import { isClosedTicketStatus } from "@/lib/ticket-status"

const statusLabels: Record<string, string> = {
  NEW: "Novo",
  TRIAGE: "Em Triagem",
  DEVELOPMENT: "Desenvolvimento",
  TEST: "Em Teste",
  COMPLETED: "Concluído",
  RESOLVED: "Concluído",
  PENDING_USER: "Pendente Cliente",
  AWAITING_APPROVAL: "Aguardando Aprovação"
}

import { RobotAssignment } from "@/components/dashboard/robot-assignment"

import { TechPowerOverlay } from "@/components/ui/tech-power-overlay"
import { HighTechStatusTransition } from "@/components/ui/high-tech-status-transition"

interface TicketDetailViewProps {
  ticketId: string
  onClose?: () => void
  onUpdate?: () => void
}

export function TicketDetailView({ ticketId, onClose, onUpdate }: TicketDetailViewProps) {
  const router = useRouter()
  const [ticket, setTicket] = React.useState<any>(null)
  const [comment, setComment] = React.useState("")
  const [isInternal, setIsInternal] = React.useState(false)
  const [timeSpent, setTimeSpent] = React.useState("0")
  const [pendingStatus, setPendingStatus] = React.useState<string | null>(null)
  const [startTime] = React.useState(Date.now())
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [session, setSession] = React.useState<any>(null)
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = React.useState(false)
  const [isPowerActive, setIsPowerActive] = React.useState(false)
  const [isStatusTransitionActive, setIsStatusTransitionActive] = React.useState(false)
  const [transitionStatus, setTransitionStatus] = React.useState("")
  const formRef = React.useRef<HTMLDivElement>(null)

  // Planning Dates
  const [plannedStartDate, setPlannedStartDate] = React.useState<Date | undefined>(undefined)
  const [plannedDueDate, setPlannedDueDate] = React.useState<Date | undefined>(undefined)
  const [isSavingPlanning, setIsSavingPlanning] = React.useState(false)

  // Modals
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false)
  const [isForwardDialogOpen, setIsForwardDialogOpen] = React.useState(false)
  const [staffUsers, setStaffUsers] = React.useState<any[]>([])
  const [budgetAmount, setBudgetAmount] = React.useState("")
  const [budgetDescription, setBudgetDescription] = React.useState("")

  const fetchTicket = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`)
      if (!res.ok) throw new Error("Erro")
      const data = await res.json()
      setTicket(data)
      setPlannedStartDate(data.plannedStartDate ? new Date(data.plannedStartDate) : undefined)
      setPlannedDueDate(data.plannedDueDate ? new Date(data.plannedDueDate) : undefined)
    } catch (error) {
      toast.error("Erro ao carregar detalhes.")
    } finally {
      setIsLoading(false)
    }
  }, [ticketId])

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/users/staff")
      if (!res.ok) throw new Error("Falha ao carregar atendentes")
      const data = await res.json()
      setStaffUsers(data)
    } catch (error) {
      toast.error("Erro ao carregar atendentes.")
    }
  }

  // Lógica de Datas
  const handleStartDateChange = (date?: Date) => {
    setPlannedStartDate(date)
    if (date && plannedDueDate && date > plannedDueDate) {
      setPlannedDueDate(undefined)
      toast.info("Data de início posterior à entrega. A entrega foi limpa.")
    }
  }

  const handleUpdatePlanning = async () => {
    console.log("[FRONTEND_DEBUG] Saving dates:", { plannedStartDate, plannedDueDate })
    if (!plannedStartDate || !plannedDueDate) {
      toast.error("Selecione ambas as datas para confirmar.")
      return
    }

    setIsSavingPlanning(true)
    const payload = {
      plannedStartDate: plannedStartDate.toISOString(),
      plannedDueDate: plannedDueDate.toISOString()
    }
    console.log("[FRONTEND_DEBUG] Payload to API:", payload)
    
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        toast.success("Cronograma confirmado!")
        const updated = await res.json()
        console.log("[FRONTEND_DEBUG] Update success:", updated)
        setTicket(updated)
        setPlannedStartDate(updated.plannedStartDate ? new Date(updated.plannedStartDate) : undefined)
        setPlannedDueDate(updated.plannedDueDate ? new Date(updated.plannedDueDate) : undefined)
        if (onUpdate) onUpdate()
      } else {
        const errorData = await res.json()
        console.error("[FRONTEND_DEBUG] Server Detailed Error:", errorData)
        toast.error(`Falha: ${errorData.details || "Erro desconhecido"}`)
      }
    } catch (error) { 
      console.error("[FRONTEND_DEBUG] Request failed:", error)
      toast.error("Erro na requisição.") 
    } finally { 
      setIsSavingPlanning(false) 
    }
  }

  const hasPlanningChanged = React.useMemo(() => {
    if (!plannedStartDate || !plannedDueDate) return false
    const originalStart = ticket?.plannedStartDate ? new Date(ticket.plannedStartDate).getTime() : null
    const originalDue = ticket?.plannedDueDate ? new Date(ticket.plannedDueDate).getTime() : null
    const currentStart = plannedStartDate.getTime()
    const currentDue = plannedDueDate.getTime()
    return originalStart !== currentStart || originalDue !== currentDue
  }, [ticket, plannedStartDate, plannedDueDate])

  const handleForward = async (assigneeId: string) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: ticket.status === "NEW" ? "TRIAGE" : ticket.status,
          assigneeId,
          comment: `Encaminhado para atendente.`,
          isInternal: true
        })
      })
      if (res.ok) {
        toast.success("Encaminhado!")
        if (onUpdate) onUpdate(); if (onClose) onClose()
      }
    } catch (error) { toast.error("Erro.") } finally { setIsSubmitting(false) }
  }

  const handleAssignToMe = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigneeId: session?.user?.id, comment: "Chamado assumido." })
      })
      if (res.ok) { toast.success("Você assumiu!"); if (onUpdate) onUpdate(); await fetchTicket() }
    } catch (error) { toast.error("Erro.") } finally { setIsSubmitting(false) }
  }

  React.useEffect(() => {
    fetchTicket()
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data))
      .catch(() => setSession(null))
  }, [ticketId, fetchTicket])

  const user = session?.user
  const activeRole = user?.activeRole || "USER"
  const canInternal = activeRole === "ADMIN" || activeRole === "AGENT"
  const isRequester = user?.id === ticket?.requesterId
  const canApprove = isRequester && activeRole === "USER" && ticket?.status === "AWAITING_APPROVAL"
  
  const isSurveyExpired = React.useMemo(() => {
    if (!ticket || !isClosedTicketStatus(ticket.status)) return false
    return (new Date().getTime() - new Date(ticket.updatedAt).getTime()) > 3 * 24 * 60 * 60 * 1000
  }, [ticket])
  const canSurvey = isRequester && activeRole === "USER" && isClosedTicketStatus(ticket?.status) && !isSurveyExpired

  const triggerStatusAnimation = (status: string) => {
    setTransitionStatus(statusLabels[status] || status)
    setIsStatusTransitionActive(true)
    setTimeout(() => setIsStatusTransitionActive(false), 2500)
  }

  const handleStatusButtonClick = (status: string) => {
    if (status === "AWAITING_APPROVAL") { setIsApprovalDialogOpen(true); return }
    setPendingStatus(status); if (status === "PENDING_USER") setIsInternal(false)
    toast.info(`Descreva a atividade abaixo para alterar o status para ${statusLabels[status] || status}.`)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const pasteTime = () => setTimeSpent(Math.floor((Date.now() - startTime) / 60000).toString())

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment || comment === "<p></p>") return toast.error("Descreva a atividade.")
    
    if (pendingStatus) triggerStatusAnimation(pendingStatus)
    
    setIsSubmitting(true)
    try {
      const payload = pendingStatus ? { status: pendingStatus, comment, isInternal, timeSpent: parseInt(timeSpent) || 0 } 
                                   : { content: comment, isInternal, timeSpent: parseInt(timeSpent) || 0 }
      const res = await fetch(`/api/tickets/${ticketId}${pendingStatus ? "" : "/comments"}`, {
        method: pendingStatus ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setComment(""); setIsInternal(false); setTimeSpent("0"); setPendingStatus(null)
        toast.success("Sucesso!"); if (onUpdate) onUpdate()
        if (pendingStatus && onClose) {
          onClose()
        } else {
          await fetchTicket()
        }
      }
    } catch (error) { toast.error("Erro.") } finally { setIsSubmitting(false) }
  }

  const handleRequestApproval = async () => {
    if (!budgetAmount || !budgetDescription) return toast.error("Preencha tudo.")
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "AWAITING_APPROVAL", budgetAmount: parseFloat(budgetAmount), budgetDescription, isInternal: false })
      })
      if (res.ok) { toast.success("Enviado!"); if (onUpdate) onUpdate(); if (onClose) onClose() }
    } catch (error) { toast.error("Erro.") } finally { setIsSubmitting(false) }
  }

  const timeline = React.useMemo(() => {
    if (!ticket) return []
    const t = (ticket.transitions || []).map((i: any) => ({ ...i, timelineType: "transition" }))
    const c = (ticket.comments || []).map((i: any) => ({ ...i, timelineType: "comment" }))
    return [...t, ...c].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [ticket])

  const totalTimeSpent = React.useMemo(() => (ticket?.comments || []).reduce((acc: number, c: any) => acc + (c.timeSpent || 0), 0), [ticket])

  if (isLoading) return <div className="p-8 text-white animate-pulse">Carregando chamado...</div>
  if (!ticket) return <div className="p-8 text-white">Chamado não encontrado.</div>

  return (
    <div className="h-full overflow-x-auto overflow-y-auto overscroll-contain">
      <HighTechStatusTransition active={isStatusTransitionActive} status={transitionStatus} />
      <div className="mx-auto min-w-[980px] max-w-6xl space-y-6 px-4 py-6 pb-24 sm:space-y-8 sm:p-6 lg:p-8">
        {/* Modals */}
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-purple-400" /> Orçamento</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label className="text-[10px] uppercase font-black text-white/40">Valor (R$)</Label><Input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className="bg-black/40 border-white/10" /></div>
              <div className="space-y-2"><Label className="text-[10px] uppercase font-black text-white/40">Motivo</Label><Textarea value={budgetDescription} onChange={(e) => setBudgetDescription(e.target.value)} className="bg-black/40 border-white/10 h-24" /></div>
            </div>
            <DialogFooter><Button variant="ghost" onClick={() => setIsApprovalDialogOpen(false)}>Cancelar</Button><Button onClick={handleRequestApproval} disabled={isSubmitting} className="bg-purple-500 hover:bg-purple-600">Enviar</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-indigo-400" /> Encaminhar</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {staffUsers.filter(u => u.id !== session?.user?.id && !u.isAI).map((staff) => (
                <button key={staff.id} onClick={() => handleForward(staff.id)} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left group">
                  <div><div className="text-sm font-bold group-hover:text-indigo-400">{staff.name}</div><div className="text-[10px] text-white/40">{staff.email}</div></div>
                  <Badge variant="outline" className="text-[9px] uppercase opacity-50">{staff.role}</Badge>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <SatisfactionSurvey ticketId={ticketId} isPopup={true} open={isSurveyDialogOpen} onOpenChange={setIsSurveyDialogOpen} onSuccess={() => fetchTicket()} existingSurvey={ticket.survey} />

        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-white border-0 text-[10px] font-black uppercase tracking-widest h-5 px-2 shadow-lg shadow-primary/20">{statusLabels[ticket.status]}</Badge>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[11px] text-white/60 font-black tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">ID {ticketId}</span>
              </div>
              <div className="overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-3 pr-3">
                  <h1 className="text-2xl font-black text-white tracking-tight leading-tight sm:text-3xl">{ticket.title}</h1>
                  <RobotAssignment 
                    ticketId={ticket.id} 
                    currentAssigneeId={ticket.assigneeId} 
                    onAssigned={() => {
                      triggerStatusAnimation("TRIAGE")
                      fetchTicket()
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2 pr-3">
              {canInternal && (
                <>
                  {!ticket.assigneeId ? (
                    <Button onClick={handleAssignToMe} className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 gap-2 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-emerald-900/20">Assumir</Button>
                  ) : (
                    <>
                      {ticket.status === "NEW" && <Button onClick={() => handleStatusButtonClick("TRIAGE")} className="bg-amber-500 hover:bg-amber-600 h-10 px-6 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-amber-900/20">Iniciar Triagem</Button>}
                      {ticket.status === "TRIAGE" && <Button onClick={() => handleStatusButtonClick("DEVELOPMENT")} className="bg-blue-600 hover:bg-blue-700 h-10 px-6 gap-2 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-900/20"><Zap className="h-4 w-4" /> Mover para Dev</Button>}
                      {ticket.status === "DEVELOPMENT" && <Button onClick={() => handleStatusButtonClick("TEST")} className="bg-pink-600 hover:bg-pink-700 h-10 px-6 gap-2 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-pink-900/20">Enviar para Teste</Button>}
                      {ticket.status === "TEST" && <Button onClick={() => handleStatusButtonClick("COMPLETED")} className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 gap-2 font-black uppercase text-[11px] tracking-widest">Resolver</Button>}
                      {ticket.status === "AWAITING_APPROVAL" && <Button onClick={() => handleStatusButtonClick("TRIAGE")} variant="outline" className="border-red-500/30 text-red-400 h-10 px-4 font-black uppercase text-[11px] tracking-widest"><XCircle className="h-4 w-4 mr-2" /> Cancelar Aprovação</Button>}
                      {ticket.status === "PENDING_USER" && <Button onClick={() => handleStatusButtonClick("TRIAGE")} variant="outline" className="border-primary/30 text-primary h-10 px-4 font-black uppercase text-[11px] tracking-widest"><Zap className="h-4 w-4 mr-2" /> Retomar Atendimento</Button>}
                    </>
                  )}
                  {ticket.status !== "NEW" && !isClosedTicketStatus(ticket.status) && ticket.status !== "TEST" && ticket.status !== "AWAITING_APPROVAL" && ticket.status !== "PENDING_USER" && (
                    <Button variant="outline" onClick={() => handleStatusButtonClick("COMPLETED")} className="border-emerald-500/30 text-emerald-500 h-10 px-4 font-black uppercase text-[11px] tracking-widest hidden sm:flex">Resolver</Button>
                  )}
                  {!isClosedTicketStatus(ticket.status) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"><MoreHorizontal className="h-5 w-5 text-white/70" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 bg-slate-950 border-white/10 text-white shadow-2xl p-2 rounded-2xl">
                        <DropdownMenuLabel className="text-[10px] uppercase font-black text-white/30 px-3 py-2 tracking-widest">Ações Avançadas</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { fetchStaff(); setIsForwardDialogOpen(true) }} className="gap-3 p-3 cursor-pointer"><div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20"><Send className="h-4 w-4 text-indigo-400" /></div><span className="font-bold text-xs">Encaminhar</span></DropdownMenuItem>
                        {ticket.status !== "AWAITING_APPROVAL" && <DropdownMenuItem onClick={() => setIsApprovalDialogOpen(true)} className="gap-3 p-3 cursor-pointer"><div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20"><DollarSign className="h-4 w-4 text-purple-400" /></div><span className="font-bold text-xs">Solicitar Orçamento</span></DropdownMenuItem>}
                        {ticket.status !== "PENDING_USER" && <DropdownMenuItem onClick={() => handleStatusButtonClick("PENDING_USER")} className="gap-3 p-3 cursor-pointer"><div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20"><MessageSquare className="h-4 w-4 text-orange-400" /></div><span className="font-bold text-xs">Solicitar Retorno</span></DropdownMenuItem>}
                        {ticket.status === "TEST" && <DropdownMenuItem onClick={() => handleStatusButtonClick("DEVELOPMENT")} className="gap-3 p-3 cursor-pointer"><div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20"><XCircle className="h-4 w-4 text-red-400" /></div><span className="font-bold text-xs">Reprovar</span></DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8 space-y-8">
            {canApprove && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col gap-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                  <div><h3 className="font-black text-white uppercase tracking-tight">Aprovação Necessária</h3><p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Autorize o custo para prosseguir.</p></div>
                </div>
                {ticket.budgetAmount > 0 && <div className="bg-black/40 p-5 rounded-2xl border border-white/5"><div className="text-[10px] uppercase font-black text-white/20 tracking-widest mb-1">Valor</div><div className="text-2xl font-black text-emerald-400">R$ {ticket.budgetAmount.toFixed(2)}</div><div className="text-[10px] uppercase font-black text-white/20 tracking-widest mt-4">Justificativa</div><p className="text-sm text-white/80 italic">"{ticket.budgetDescription}"</p></div>}
                <div className="flex gap-3"><Button onClick={() => { setPendingStatus("TRIAGE"); setComment("Aprovado."); formRef.current?.scrollIntoView() }} className="bg-primary hover:bg-primary/90 px-8 font-black uppercase text-[11px] tracking-widest h-10 rounded-xl">Aprovar</Button><Button variant="ghost" onClick={() => { setPendingStatus("COMPLETED"); setComment("Recusado."); formRef.current?.scrollIntoView() }} className="text-white/40 hover:text-red-400 font-black uppercase text-[11px] tracking-widest h-10">Recusar</Button></div>
              </motion.div>
            )}

            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border-t-2 border-t-white/5">
              <CardHeader className="bg-white/5 py-4 px-6"><CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white/40"><FileText className="h-4 w-4" /> Detalhamento</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto p-4 sm:p-6 lg:p-8"><RichTextRenderer content={ticket.description} />{ticket.attachments?.length > 0 && <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-3">{ticket.attachments.map((file: any) => (<a key={file.id} href={file.fileUrl} target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-tighter text-white/60 hover:bg-white/10 transition-all"><Paperclip className="h-3.5 w-3.5 text-primary" />{file.filename}</a>))}</div>}</CardContent>
            </Card>

            {canInternal ? (
              <Card ref={formRef} className={cn("border-white/10 transition-all rounded-3xl overflow-hidden shadow-xl", pendingStatus ? "bg-primary/5 border-primary/40 border-t-2" : "bg-white/[0.03]")}>
                <CardHeader className="bg-white/5 py-4 px-6">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> {pendingStatus ? "Alterar Status" : "Atividade"}
                    </div>
                    <div className="overflow-x-auto pb-1">
                      <div className="flex min-w-max items-center gap-4 pr-3">
                      <MagicCompose 
                        ticketId={ticketId} 
                        text={comment}
                        contextType="REPLY"
                        onStart={() => setIsPowerActive(true)}
                        onEnd={() => setIsPowerActive(false)}
                        onCompose={(suggestion) => setComment(suggestion)} 
                      />
                      {pendingStatus && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] text-white/30">{statusLabels[ticket.status]}</Badge>
                          <ChevronRight className="h-3 w-3 text-white/20" />
                          <Badge className="text-[10px] bg-primary text-white">{statusLabels[pendingStatus]}</Badge>
                        </div>
                      )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto p-4 sm:p-6 lg:p-8">
                  <form onSubmit={handleSubmitComment} className="space-y-6">
                    <div className="relative rounded-xl overflow-hidden">
                      <TechPowerOverlay active={isPowerActive} />
                      <RichTextEditor placeholder="Descreva aqui..." value={comment} onChange={(v) => setComment(v)} />
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="overflow-x-auto pb-1"><div className="flex min-w-max items-center gap-6 pr-3"><div className="flex items-center gap-3"><input type="checkbox" id="isInternal" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="h-5 w-5 rounded border-white/10 bg-black/40 text-primary" /><Label htmlFor="isInternal" className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">Privada <Lock className="h-3 w-3" /></Label></div><div className="flex items-center gap-3"><Label className="text-xs font-black uppercase tracking-widest text-white/40">Minutos:</Label><Input type="number" min="0" className="w-20 h-10 bg-black/40 border-white/10 text-xs font-bold text-center" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} /><Button type="button" variant="outline" size="icon" onClick={pasteTime} className="h-10 w-10 border-white/10"><History className="h-4 w-4" /></Button></div></div></div><Button type="submit" disabled={isSubmitting || !comment.trim()} className="bg-primary hover:bg-primary/80 h-11 w-full sm:w-auto px-8 font-black uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-primary/20">Registrar</Button></div></form></CardContent>
              </Card>
            ) : (!isClosedTicketStatus(ticket.status) && (
              <Card className="border-white/10 bg-white/[0.03] border-dashed rounded-3xl overflow-hidden shadow-xl">
                <CardHeader className="bg-white/5 py-4 px-6">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between text-white/40">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Responder
                    </div>
                    <MagicCompose 
                      ticketId={ticketId} 
                      text={comment}
                      contextType="REPLY"
                      onCompose={(suggestion) => setComment(suggestion)} 
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto p-4 sm:p-6 lg:p-8">
                  <form onSubmit={handleSubmitComment} className="space-y-6">
                    <RichTextEditor placeholder="Sua resposta..." value={comment} onChange={(v) => setComment(v)} />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting || !comment.trim()} className="bg-primary hover:bg-primary/80 h-11 px-8 font-black uppercase text-[11px] tracking-[0.2em]">
                        Enviar Resposta
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ))}

            <div className="space-y-8 pt-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-3 ml-2"><History className="h-4 w-4" /> Histórico</h3>
              <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
                {timeline.map((item: any) => (
                  <div key={item.id} className="relative flex items-start gap-5 pl-2 group/time sm:gap-8">
                    <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 border-2 z-10", item.timelineType === "transition" ? "border-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "border-white/20")}>{item.timelineType === "transition" ? <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> : <MessageSquare className={cn("h-3 w-3", item.isInternal ? "text-amber-500" : "text-white/40")} />}</div>
                    <div className={cn("min-w-0 flex-1 pt-0.5 transition-all", item.isInternal ? "bg-amber-500/[0.03] p-4 sm:p-6 rounded-2xl border border-amber-500/10" : "")}>
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div className="overflow-x-auto"><div className="min-w-max text-[11px] font-black uppercase tracking-widest text-white/80">{(item.performedBy || item.author).name}{item.timelineType === "transition" ? <span className="font-bold text-white/30"> » MUDOU PARA {statusLabels[item.toStatus]}</span> : <span className="font-bold text-white/30"> » RESPONDEU</span>}</div></div><time className="text-[9px] font-black text-white/20 uppercase tabular-nums">{new Date(item.createdAt).toLocaleString()}</time></div>
                      {item.content || item.comment ? (<div className="overflow-x-auto text-[13px] font-medium text-white/60 leading-relaxed"><RichTextRenderer content={item.content || item.comment} />{item.timelineType === "transition" && isClosedTicketStatus(item.toStatus) && activeRole === "USER" && !ticket.survey && !isSurveyExpired && (<div className="mt-6"><Button onClick={() => setIsSurveyDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 h-8 px-4 text-[10px] font-black uppercase tracking-widest gap-2 rounded-lg shadow-lg shadow-amber-900/20"><Star className="h-3 w-3 fill-current" /> Avaliar Agora</Button></div>)}</div>) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Cronograma Rigoroso Softdesk Style */}
            {canInternal && (
              <Card className="border-emerald-500/20 bg-emerald-500/5 rounded-3xl overflow-hidden shadow-xl border-t-2 border-t-emerald-500/30">
                <CardHeader className="bg-emerald-500/10 py-4 px-6 border-b border-emerald-500/10 flex flex-row items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Cronograma Técnico</CardTitle>
                  <Calendar className="h-3.5 w-3.5 text-emerald-500/40" />
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase font-black text-white/30 tracking-widest ml-1">Data de Início</Label>
                    <DatePicker date={plannedStartDate} setDate={handleStartDateChange} placeholder="Definir início" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase font-black text-white/30 tracking-widest ml-1">Data de Entrega</Label>
                    <DatePicker 
                      date={plannedDueDate} 
                      setDate={setPlannedDueDate} 
                      placeholder={!plannedStartDate ? "Defina o início primeiro" : "Definir entrega"} 
                      disabled={!plannedStartDate}
                      fromDate={plannedStartDate}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {hasPlanningChanged && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <Button 
                          onClick={handleUpdatePlanning} 
                          disabled={isSavingPlanning}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2 font-black uppercase text-[10px] tracking-widest h-10 shadow-lg shadow-emerald-900/20"
                        >
                          {isSavingPlanning ? "Gravando..." : "Confirmar Cronograma"}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}

            <Card className="border-white/10 bg-white/[0.02] rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-white/5 py-4 px-6 border-b border-white/5"><CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ficha Técnica</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between"><span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Cliente</span><span className="text-xs text-white font-bold break-all text-left sm:text-right">{ticket.requester?.name || "---"}</span></div>
                  <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between"><span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Atendente</span><span className="text-xs text-white font-bold break-all text-left sm:text-right">{ticket.assignee?.name || "---"}</span></div>
                  <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Prioridade</span>
                    <Badge className={cn("h-5 text-[9px] px-2 font-black uppercase border-0 shadow-sm", ticket.priority === "CRITICAL" ? "bg-red-500 text-white animate-pulse" : ticket.priority === "HIGH" ? "bg-orange-500 text-white" : "bg-white/10 text-white/60")}>{ticket.priority}</Badge>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between"><span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Categoria</span><span className="text-xs text-white/80 font-bold break-words text-left sm:text-right">{ticket.category?.name || "---"}</span></div>
                </div>
                <div className="pt-6 border-t border-white/5"><div className="flex justify-between items-end"><div className="space-y-1"><span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Esforço Total</span><p className="text-2xl font-black text-primary tracking-tighter">{totalTimeSpent} <span className="text-[10px] text-primary/40 uppercase">min</span></p></div><div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shadow-inner"><Clock className="h-5 w-5 text-primary/40" /></div></div></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
