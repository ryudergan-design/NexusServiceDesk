"use client"

import { useState } from "react"
import {
  Bot,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  UserCheck,
  UserPlus,
  UserX,
  Users as UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import { updateUserStatus, createUser, updateUser } from "@/lib/actions/users"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UsersClientProps {
  initialUsers: any[]
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("USER")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    department: "",
    jobTitle: "",
    phone: "",
    isAI: false,
    aiApiKey: "",
    aiModel: "gemini-3.1-flash-lite-preview",
    aiInstructions: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenCreate = (tabValue?: string) => {
    setEditingUser(null)
    const isBot = tabValue === "BOT" || activeTab === "BOT"
    setFormData({
      name: "",
      email: isBot ? `bot-${Math.random().toString(36).substring(7)}@nexus.ai` : "",
      role: isBot ? "AGENT" : "USER",
      department: "",
      jobTitle: "",
      phone: "",
      isAI: isBot,
      aiApiKey: "",
      aiModel: "gemini-3.1-flash-lite-preview",
      aiInstructions: "",
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "USER",
      department: user.department || "",
      jobTitle: user.jobTitle || "",
      phone: user.phone || "",
      isAI: user.isAI || false,
      aiApiKey: user.aiApiKey || "",
      aiModel: user.aiModel || "gemini-3.1-flash-lite-preview",
      aiInstructions: user.aiInstructions || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData)
        setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
        toast.success("Dados atualizados!")
      } else {
        const created = await createUser(formData)
        setUsers((prev) => [created, ...prev])
        toast.success(formData.isAI ? "Agente IA criado com sucesso!" : "Usuário criado com sucesso! Senha padrão: I9User123!")
      }
      setIsDialogOpen(false)
    } catch {
      toast.error("Erro ao processar solicitação.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (userId: string, data: any) => {
    try {
      await updateUserStatus(userId, data)
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...data } : user)))
      toast.success("Status atualizado!")
    } catch {
      toast.error("Erro ao atualizar status.")
    }
  }

  const renderUserActions = (user: any, aiFilter: boolean) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-white/40 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-white/10 bg-slate-900 text-white">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem onClick={() => handleOpenEdit(user)} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>

        {!user.approved ? (
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(user.id, { approved: true })}
            className="cursor-pointer text-emerald-400 hover:bg-emerald-500/10"
          >
            <UserCheck className="mr-2 h-4 w-4" /> Ativar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(user.id, { approved: false })}
            className="cursor-pointer text-amber-400 hover:bg-amber-500/10"
          >
            <UserX className="mr-2 h-4 w-4" /> Desativar
          </DropdownMenuItem>
        )}

        {!aiFilter && (
          <>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, { role: "ADMIN", isAI: false })} className="cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Tornar ADMIN
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, { role: "AGENT", isAI: false })} className="cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4 text-purple-400" /> Tornar ATENDENTE
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, { role: "USER", isAI: false })} className="cursor-pointer">
              <ShieldAlert className="mr-2 h-4 w-4 text-white/40" /> Tornar CLIENTE
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderUserCards = (roleUsers: any[], aiFilter: boolean) => {
    if (!roleUsers.length) {
      return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm italic text-white/30 md:hidden">
          Nenhum registro encontrado.
        </div>
      )
    }

    return (
      <div className="space-y-3 md:hidden">
        {roleUsers.map((user) => (
          <div key={user.id} className="rounded-[1.6rem] border border-white/10 bg-black/30 p-4 shadow-[0_0_25px_rgba(0,0,0,0.18)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-white">{user.name}</span>
                  {user.isAI && <Bot className="h-3.5 w-3.5 shrink-0 animate-pulse text-primary" />}
                </div>
                <p className="break-all text-xs text-white/40">{user.email}</p>
              </div>
              {renderUserActions(user, aiFilter)}
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Status</span>
                {user.approved ? (
                  <Badge className="flex w-fit items-center gap-1 border-0 bg-emerald-500/10 text-[10px] text-emerald-500">
                    <UserCheck className="h-3 w-3" /> Ativo
                  </Badge>
                ) : (
                  <Badge className="flex w-fit items-center gap-1 border-0 bg-amber-500/10 text-[10px] text-amber-500">
                    <UserX className="h-3 w-3" /> Inativo
                  </Badge>
                )}
              </div>

              {!aiFilter && (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Departamento</span>
                    <span className="text-right text-sm text-white/60">{user.department || "-"}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Cargo</span>
                    <span className="text-right text-sm text-white/60">{user.jobTitle || "-"}</span>
                  </div>
                </>
              )}

              {aiFilter && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Modelo</span>
                  <span className="break-all text-right font-mono text-xs text-white/60">
                    {user.aiModel || "gemini-3.1-flash-lite-preview"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderUserTable = (roleFilter: string, aiFilter = false) => {
    const roleUsers = filteredUsers.filter((user) => (aiFilter ? user.isAI === true : user.role === roleFilter && !user.isAI))

    return (
      <div className="mt-4 space-y-3">
        {renderUserCards(roleUsers, aiFilter)}

        <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-black/40 md:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">{aiFilter ? "Nome do Agente" : "Usuário"}</TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                  {!aiFilter && <TableHead className="text-white/60">Departamento</TableHead>}
                  {!aiFilter && <TableHead className="text-white/60">Cargo</TableHead>}
                  {aiFilter && <TableHead className="text-white/60">Modelo</TableHead>}
                  <TableHead className="text-right text-white/60">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleUsers.length > 0 ? (
                  roleUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{user.name}</span>
                            {user.isAI && <Bot className="h-3 w-3 animate-pulse text-primary" />}
                          </div>
                          <span className="text-xs text-white/40">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.approved ? (
                          <Badge className="flex w-fit items-center gap-1 border-0 bg-emerald-500/10 text-[10px] text-emerald-500">
                            <UserCheck className="h-3 w-3" /> Ativo
                          </Badge>
                        ) : (
                          <Badge className="flex w-fit items-center gap-1 border-0 bg-amber-500/10 text-[10px] text-amber-500">
                            <UserX className="h-3 w-3" /> Inativo
                          </Badge>
                        )}
                      </TableCell>
                      {!aiFilter && <TableCell className="text-sm text-white/60">{user.department || "-"}</TableCell>}
                      {!aiFilter && <TableCell className="text-sm text-white/60">{user.jobTitle || "-"}</TableCell>}
                      {aiFilter && <TableCell className="text-xs font-mono text-white/60">{user.aiModel || "gemini-3.1-flash-lite-preview"}</TableCell>}
                      <TableCell className="text-right">{renderUserActions(user, aiFilter)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={aiFilter ? 4 : 5} className="h-24 text-center italic text-white/20">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar..."
              className="h-11 rounded-2xl border-white/10 bg-white/5 pl-10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab !== "BOT" && (
            <Button onClick={() => handleOpenCreate()} className="h-11 w-full gap-2 rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-primary/90 md:w-auto">
              <UserPlus className="h-4 w-4" /> Novo Usuário
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90dvh] w-[calc(100vw-1.5rem)] overflow-y-auto border-white/10 bg-slate-900 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {formData.isAI ? <Bot className="h-5 w-5 text-primary" /> : <UserIcon className="h-5 w-5 text-primary" />}
              {editingUser ? "Editar" : "Criar"} {formData.isAI ? "Agente IA" : "Usuário"}
            </DialogTitle>
            <DialogDescription className="text-white/40">Preencha os dados básicos abaixo.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className={cn("space-y-2", formData.isAI ? "sm:col-span-2" : "sm:col-span-1")}>
                <Label htmlFor="name" className="text-xs font-bold uppercase text-white/60">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-white/10 bg-black/40 text-white"
                  required
                />
              </div>

              {!formData.isAI && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase text-white/60">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled={!!editingUser}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-white/10 bg-black/40 text-white"
                    required
                  />
                </div>
              )}

              {!formData.isAI && (
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs font-bold uppercase text-white/60">Perfil</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="border-white/10 bg-black/40 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-900 text-white">
                      <SelectItem value="USER">Cliente</SelectItem>
                      <SelectItem value="AGENT">Atendente</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.isAI && (
                <>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="aiApiKey" className="text-xs font-bold uppercase text-white/60">Token / API Key</Label>
                    <Input
                      id="aiApiKey"
                      type="password"
                      value={formData.aiApiKey}
                      onChange={(e) => setFormData({ ...formData, aiApiKey: e.target.value })}
                      className="border-white/10 bg-black/40 text-white"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="aiModel" className="text-xs font-bold uppercase text-white/60">Modelo</Label>
                    <Select value={formData.aiModel || "gemini-3.1-flash-lite-preview"} onValueChange={(value) => setFormData({ ...formData, aiModel: value })}>
                      <SelectTrigger className="border-white/10 bg-black/40 text-white">
                        <SelectValue placeholder="Selecione o modelo..." />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-slate-900 text-white">
                        <SelectItem value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite Preview (Recomendado)</SelectItem>
                        <SelectItem value="gemini-3-flash-preview">Gemini 3 Flash Preview</SelectItem>
                        <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="aiInstructions" className="text-xs font-bold uppercase text-white/60">Instruções do Sistema</Label>
                    <textarea
                      id="aiInstructions"
                      placeholder="Ex: Você é um atendente especializado em SaaS..."
                      value={formData.aiInstructions}
                      onChange={(e) => setFormData({ ...formData, aiInstructions: e.target.value })}
                      className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              {!formData.isAI && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase text-white/60">Telefone</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-white/10 bg-black/40 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept" className="text-xs font-bold uppercase text-white/60">Departamento</Label>
                    <Input id="dept" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="border-white/10 bg-black/40 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase text-white/60">Cargo</Label>
                    <Input id="title" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} className="border-white/10 bg-black/40 text-white" />
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="w-full text-white/40 sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="w-full bg-primary px-8 text-white hover:bg-primary/90 sm:w-auto">
                {loading ? "Gravando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="USER" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-[1.4rem] border border-white/10 bg-white/5 p-1.5">
          <TabsTrigger value="ADMIN" className="h-10 gap-2 rounded-2xl px-5 font-black uppercase tracking-[0.14em] data-[state=active]:bg-primary data-[state=active]:text-white">
            <Shield className="h-4 w-4" /> Admins
          </TabsTrigger>
          <TabsTrigger value="AGENT" className="h-10 gap-2 rounded-2xl px-5 font-black uppercase tracking-[0.14em] data-[state=active]:bg-primary data-[state=active]:text-white">
            <UsersIcon className="h-4 w-4" /> Atendentes
          </TabsTrigger>
          <TabsTrigger value="USER" className="h-10 gap-2 rounded-2xl px-5 font-black uppercase tracking-[0.14em] data-[state=active]:bg-primary data-[state=active]:text-white">
            <UserIcon className="h-4 w-4" /> Clientes
          </TabsTrigger>
          <TabsTrigger value="BOT" className="h-10 gap-2 rounded-2xl px-5 font-black uppercase tracking-[0.14em] data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bot className="h-4 w-4" /> Agentes (IA)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ADMIN">{renderUserTable("ADMIN")}</TabsContent>
        <TabsContent value="AGENT">{renderUserTable("AGENT")}</TabsContent>
        <TabsContent value="USER">{renderUserTable("USER")}</TabsContent>
        <TabsContent value="BOT">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => handleOpenCreate("BOT")}
              className="h-11 w-full gap-2 rounded-2xl bg-amber-500 font-black uppercase tracking-[0.18em] text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-600 md:w-auto"
            >
              <Bot className="h-4 w-4" /> Novo Agente IA
            </Button>
          </div>
          {renderUserTable("AGENT", true)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
