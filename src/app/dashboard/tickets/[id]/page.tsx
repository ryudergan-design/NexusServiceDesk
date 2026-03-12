"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
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
  UserPlus
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { SatisfactionSurvey } from "@/components/dashboard/satisfaction-survey"

const statusLabels: Record<string, string> = {
  NEW: "Novo",
  TRIAGE: "Em Triagem",
  DEVELOPMENT: "Desenvolvimento",
  TEST: "Em Teste",
  COMPLETED: "Concluído",
  PENDING_USER: "Pendente Usuário",
  AWAITING_APPROVAL: "Aguardando Aprovação"
}

export default function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

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
  const formRef = React.useRef<HTMLDivElement>(null)

  // Modals
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false)
  const [isForwardDialogOpen, setIsForwardDialogOpen] = React.useState(false)
  const [staffUsers, setStaffUsers] = React.useState<any[]>([])
  const [budgetAmount, setBudgetAmount] = React.useState("")
  const [budgetDescription, setBudgetDescription] = React.useState("")

  const fetchTicket = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`)
      if (!res.ok) {
        if (res.status === 403) {
          toast.error("Você não tem permissão para visualizar este chamado.")
          router.push("/dashboard")
          return
        }
        throw new Error("Erro")
      }
      const data = await res.json()
      setTicket(data)
    } catch (error) {
      toast.error("Não foi possível carregar os detalhes do chamado.")
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/users/staff")
      const data = await res.json()
      setStaffUsers(data)
    } catch (error) {
      toast.error("Erro ao carregar atendentes.")
    }
  }

  const handleForward = async (assigneeId: string) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: ticket.status === "NEW" ? "TRIAGE" : ticket.status,
          assigneeId,
          comment: `Chamado encaminhado para o atendente ${staffUsers.find(u => u.id === assigneeId)?.name}.`,
          isInternal: true,
          timeSpent: 0
        })
      })
      if (res.ok) {
        toast.success("Encaminhado!")
        setIsForwardDialogOpen(false)
        await fetchTicket()
        router.refresh()
      }
    } catch (error) { toast.error("Erro ao encaminhar.") } finally { setIsSubmitting(false) }
  }

  const handleAssignToMe = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          assigneeId: user.id,
          comment: "Chamado assumido pelo atendente." 
        })
      })

      if (res.ok) {
        toast.success("Você agora é o responsável por este chamado.")
        await fetchTicket()
        router.refresh()
      }
    } catch (error) {
      toast.error("Erro ao assumir chamado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    fetchTicket()
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => setSession(data))
    
    // Abrir pesquisa se vier da notificação
    if (typeof window !== "undefined" && window.location.search.includes("openSurvey=true")) {
      setIsSurveyDialogOpen(true)
    }
  }, [id, fetchTicket])

  // Helpers de Permissão
  const user = session?.user
  const activeRole = user?.activeRole || "USER"
  const canInternal = activeRole === "ADMIN" || activeRole === "AGENT"
  const isRequester = user?.id === ticket?.requesterId
  const canApprove = isRequester && activeRole === "USER" && ticket?.status === "AWAITING_APPROVAL"
  
  // Pesquisa expira após 3 dias (72h)
  const isSurveyExpired = React.useMemo(() => {
    if (!ticket || ticket.status !== "COMPLETED") return false
    const diff = new Date().getTime() - new Date(ticket.updatedAt).getTime()
    return diff > 3 * 24 * 60 * 60 * 1000
  }, [ticket])

  const canSurvey = isRequester && activeRole === "USER" && ticket?.status === "COMPLETED" && !isSurveyExpired

  const handleStatusButtonClick = (status: string) => {
    if (status === "AWAITING_APPROVAL") {
      setIsApprovalDialogOpen(true)
      return
    }
    setPendingStatus(status)
    if (status === "PENDING_USER") setIsInternal(false)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const pasteTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 60000)
    setTimeSpent(elapsed.toString())
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment || comment === "<p></p>") {
      toast.error("Descreva a atividade.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = pendingStatus ? {
        status: pendingStatus,
        comment,
        isInternal,
        timeSpent: parseInt(timeSpent) || 0
      } : {
        content: comment,
        isInternal,
        timeSpent: parseInt(timeSpent) || 0
      }

      const res = await fetch(`/api/tickets/${id}${pendingStatus ? "" : "/comments"}`, {
        method: pendingStatus ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setComment(""); setIsInternal(false); setTimeSpent("0"); setPendingStatus(null)
        toast.success("Sucesso!")
        await fetchTicket()
        router.refresh()
      }
    } catch (error) {
      toast.error("Erro ao salvar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestApproval = async () => {
    if (!budgetAmount || !budgetDescription) return toast.error("Preencha tudo.")
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "AWAITING_APPROVAL",
          budgetAmount: parseFloat(budgetAmount),
          budgetDescription,
          comment: `Aprovação solicitada (R$ ${budgetAmount})`,
          isInternal: false,
          timeSpent: 0
        })
      })
      if (res.ok) {
        toast.success("Enviado!"); setIsApprovalDialogOpen(false)
        setBudgetAmount(""); setBudgetDescription("")
        await fetchTicket(); router.refresh()
      }
    } catch (error) { toast.error("Erro.") } finally { setIsSubmitting(false) }
  }

  const timeline = React.useMemo(() => {
    if (!ticket) return []
    const t = (ticket.transitions || []).map((item: any) => ({ ...item, timelineType: "transition" }))
    const c = (ticket.comments || []).map((item: any) => ({ ...item, timelineType: "comment" }))
    return [...t, ...c].sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [ticket])

  const totalTimeSpent = React.useMemo(() => {
    if (!ticket?.comments) return 0
    return ticket.comments.reduce((acc: number, c: any) => acc + (c.timeSpent || 0), 0)
  }, [ticket])

  if (isLoading) return <div className="p-8 text-white animate-pulse">Carregando chamado...</div>
  if (!ticket) return <div className="p-8 text-white">Chamado não encontrado.</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-purple-400" /> Solicitar Aprovação</DialogTitle>
            <DialogDescription className="text-white/40 text-xs">Informe o orçamento para o cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-white/40">Valor (R$)</Label>
              <Input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} className="bg-black/40 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-white/40">Motivo</Label>
              <Textarea value={budgetDescription} onChange={(e) => setBudgetDescription(e.target.value)} className="bg-black/40 border-white/10 h-24" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsApprovalDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleRequestApproval} disabled={isSubmitting} className="bg-purple-500 hover:bg-purple-600">Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-indigo-400" /> Encaminhar Chamado</DialogTitle>
            <DialogDescription className="text-white/40 text-xs">Selecione um atendente para assumir este chamado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {staffUsers.filter(u => u.id !== user?.id).map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleForward(staff.id)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left group"
                >
                  <div>
                    <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{staff.name}</div>
                    <div className="text-[10px] text-white/40">{staff.email}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50">{staff.role}</Badge>
                </button>
              ))}
              {staffUsers.filter(u => u.id !== user?.id).length === 0 && (
                <div className="text-center py-8 text-white/20 text-xs italic">Nenhum outro atendente disponível.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SatisfactionSurvey 
        ticketId={id} isPopup={true} open={isSurveyDialogOpen} 
        onOpenChange={setIsSurveyDialogOpen} onSuccess={() => fetchTicket()}
        existingSurvey={ticket.survey}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/60 shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/30 tracking-widest">#{ticket.id}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{statusLabels[ticket.status]}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{ticket.title}</h1>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {canInternal && (
            <>
              {!ticket.assigneeId && (
                <Button onClick={handleAssignToMe} className="bg-emerald-600 hover:bg-emerald-700 h-9 gap-2">
                  <UserPlus className="h-4 w-4" /> Assumir Chamado
                </Button>
              )}
              
              {ticket.status !== "COMPLETED" && (
                <Button onClick={() => { fetchStaff(); setIsForwardDialogOpen(true) }} className="bg-indigo-600 hover:bg-indigo-700 h-9 gap-2">
                  <Send className="h-4 w-4" /> Encaminhar
                </Button>
              )}

              {ticket.status === "NEW" && <Button onClick={() => handleStatusButtonClick("TRIAGE")} className="bg-amber-500 hover:bg-amber-600 h-9">Iniciar Triagem</Button>}
              
              {ticket.status !== "NEW" && ticket.status !== "COMPLETED" && (
                <>
                  <Button onClick={() => setIsApprovalDialogOpen(true)} variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 h-9 gap-2">
                    <DollarSign className="h-4 w-4" /> Solicitar Aprovação
                  </Button>
                  <Button onClick={() => handleStatusButtonClick("COMPLETED")} className="bg-emerald-500 hover:bg-emerald-600 h-9">Resolver</Button>
                </>
              )}

              {ticket.status !== "PENDING_USER" && ticket.status !== "COMPLETED" && <Button onClick={() => handleStatusButtonClick("PENDING_USER")} variant="outline" className="border-amber-500/50 text-amber-500 h-9">Solicitar Retorno</Button>}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {canApprove && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-purple-400" /></div>
                <div><h3 className="font-bold text-white">Aprovação Necessária</h3><p className="text-sm text-white/60 text-xs">Autorize o custo estimado para prosseguir.</p></div>
              </div>
              {ticket.budgetAmount > 0 && <div className="bg-black/40 p-4 rounded-xl border border-white/5"><div className="text-[10px] uppercase font-bold text-white/30">Valor</div><div className="text-xl font-bold text-emerald-400">R$ {ticket.budgetAmount.toFixed(2)}</div><div className="text-[10px] uppercase font-bold text-white/30 mt-2">Justificativa</div><p className="text-sm text-white/80 italic">"{ticket.budgetDescription}"</p></div>}
              <div className="flex gap-3">
                <Button onClick={() => { setPendingStatus("TRIAGE"); setComment("Aprovado."); formRef.current?.scrollIntoView() }} className="bg-purple-500 hover:bg-purple-600 px-8">Aprovar</Button>
                <Button variant="ghost" onClick={() => { setPendingStatus("COMPLETED"); setComment("Recusado."); formRef.current?.scrollIntoView() }} className="text-white/40 hover:text-red-400">Recusar</Button>
              </div>
            </motion.div>
          )}

          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Descrição</CardTitle></CardHeader>
            <CardContent>
              <RichTextRenderer content={ticket.description} />
              {ticket.attachments?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                  {ticket.attachments.map((file: any) => (<a key={file.id} href={file.fileUrl} target="_blank" className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10"><FileText className="h-4 w-4 text-primary" />{file.filename}</a>))}
                </div>
              )}
            </CardContent>
          </Card>

          {canSurvey && !ticket.survey && <SatisfactionSurvey ticketId={ticket.id} onSuccess={() => fetchTicket()} />}

          {canInternal ? (
            <Card ref={formRef} className={`border-white/10 transition-all ${pendingStatus ? "bg-primary/5 border-primary/40" : "bg-white/5"}`}>
              <CardHeader><CardTitle className="text-lg flex items-center justify-between"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> {pendingStatus ? "Mudar Status" : "Atividade"}</div>{pendingStatus && <div className="flex items-center gap-2"><Badge variant="outline" className="text-[10px] text-white/30">{statusLabels[ticket.status]}</Badge><ChevronRight className="h-3 w-3 text-white/20" /><Badge className="text-[10px] bg-primary text-white">{statusLabels[pendingStatus]}</Badge></div>}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <RichTextEditor placeholder="O que foi feito?" value={comment} onChange={(v) => setComment(v)} />
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2"><input type="checkbox" id="isInternal" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="h-4 w-4" /><Label htmlFor="isInternal" className="text-xs text-white/60">Privada <Lock className="h-3 w-3" /></Label></div>
                      <div className="flex items-center gap-2"><Label className="text-xs text-white/60">Minutos:</Label><Input type="number" min="0" className="w-20 h-8 bg-black/40 text-xs" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} /><Button type="button" variant="outline" size="icon" onClick={pasteTime} className="h-8 w-8"><History className="h-3 w-3" /></Button></div>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !comment.trim()} className="bg-primary hover:bg-primary/80">Enviar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            ticket.status !== "COMPLETED" && (
              <Card className="border-white/10 bg-white/5 border-dashed">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Responder</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <RichTextEditor placeholder="Sua resposta..." value={comment} onChange={(v) => setComment(v)} />
                    <div className="flex justify-end"><Button type="submit" disabled={isSubmitting || !comment.trim()} className="bg-primary hover:bg-primary/80">Enviar</Button></div>
                  </form>
                </CardContent>
              </Card>
            )
          )}

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Timeline</h3>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-white/5">
              {timeline.map((item: any) => (
                <div key={item.id} className="relative flex items-start gap-6 pl-2">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black border ${item.timelineType === "transition" ? "border-primary/50" : "border-white/20"} z-10`}>{item.timelineType === "transition" ? <div className="h-2 w-2 rounded-full bg-primary" /> : <MessageSquare className={`h-3 w-3 ${item.isInternal ? "text-amber-500" : "text-white/40"}`} />}</div>
                  <div className={`flex-1 pt-0.5 ${item.isInternal ? "bg-amber-500/5 p-4 rounded-xl border border-amber-500/10" : ""}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-white">{(item.performedBy || item.author).name}{item.timelineType === "transition" ? <span className="font-normal text-white/40"> alterou para {statusLabels[item.toStatus]}</span> : <span className="font-normal text-white/40"> respondeu</span>}</div>
                      <time className="text-[10px] text-white/20">{new Date(item.createdAt).toLocaleString()}</time>
                    </div>
                    {item.content || item.comment ? (<div className="mt-2 text-sm text-white/80"><RichTextRenderer content={item.content || item.comment} />{item.timelineType === "transition" && item.toStatus === "COMPLETED" && activeRole === "USER" && !ticket.survey && !isSurveyExpired && (<div className="mt-4"><Button onClick={() => setIsSurveyDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 h-8 text-[10px] gap-2"><Star className="h-3 w-3" /> Avaliar Agora</Button></div>)}</div>) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-white/10 bg-black/40">
            <CardHeader><CardTitle className="text-lg">Informações</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Solicitante</span><span className="text-white">{ticket.requester.name}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Atendente</span><span className="text-white">{ticket.assignee?.name || "Pendente"}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Prioridade</span><Badge className="bg-red-500/10 text-red-500">{ticket.priority}</Badge></div>
              <div className="flex justify-between"><span className="text-white/40">Categoria</span><span className="text-white">{ticket.category.name}</span></div>
              <div className="pt-4 border-t border-white/10 flex justify-between font-bold"><span className="text-white/40">Tempo Total</span><span className="text-primary">{totalTimeSpent} min</span></div>
              {ticket.survey && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex gap-1 mb-2">{[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`h-3 w-3 ${s <= ticket.survey.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />))}</div>
                  <p className="text-[10px] text-white/40 italic">"{ticket.survey.feedback || "Sem comentário."}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
