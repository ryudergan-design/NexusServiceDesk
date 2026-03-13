"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX,
  Search,
  UserPlus,
  Pencil,
  Shield,
  Users as UsersIcon,
  Bot,
  User as UserIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { updateUserStatus, createUser, updateUser } from "@/lib/actions/users"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UsersClientProps {
  initialUsers: any[]
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("USER")
  
  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    department: "",
    jobTitle: "",
    phone: "",
    isAI: false,
    aiApiKey: "",
    aiModel: "gemini-1.5-flash",
    aiInstructions: ""
  })

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
      aiModel: "gemini-1.5-flash",
      aiInstructions: ""
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
      aiModel: user.aiModel || "gemini-1.5-flash",
      aiInstructions: user.aiInstructions || ""
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData)
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
        toast.success("Dados atualizados!")
      } else {
        const created = await createUser(formData)
        setUsers(prev => [created, ...prev])
        toast.success(formData.isAI ? "Agente IA criado com sucesso!" : "Usuário criado com sucesso! Senha padrão: I9User123!")
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Erro ao processar solicitação.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (userId: string, data: any) => {
    try {
      await updateUserStatus(userId, data)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u))
      toast.success("Status atualizado!")
    } catch (error) {
      toast.error("Erro ao atualizar status.")
    }
  }

  const renderUserTable = (roleFilter: string, aiFilter: boolean = false) => {
    const roleUsers = filteredUsers.filter(u => aiFilter ? u.isAI === true : (u.role === roleFilter && !u.isAI))
    
    return (
      <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden mt-4">
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
            {roleUsers.length > 0 ? roleUsers.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{user.name}</span>
                      {user.isAI && <Bot className="h-3 w-3 text-primary animate-pulse" />}
                    </div>
                    <span className="text-xs text-white/40">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.approved ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-0 flex w-fit items-center gap-1 text-[10px]">
                      <UserCheck className="h-3 w-3" /> Ativo
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-500 border-0 flex w-fit items-center gap-1 text-[10px]">
                      <UserX className="h-3 w-3" /> Inativo
                    </Badge>
                  )}
                </TableCell>
                {!aiFilter && (
                  <TableCell className="text-white/60 text-sm">
                    {user.department || "-"}
                  </TableCell>
                )}
                {!aiFilter && (
                  <TableCell className="text-white/60 text-sm">
                    {user.jobTitle || "-"}
                  </TableCell>
                )}
                {aiFilter && (
                  <TableCell className="text-white/60 text-xs font-mono">
                    {user.aiModel || "gemini-1.5-flash"}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-white/40 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      
                      <DropdownMenuItem onClick={() => handleOpenEdit(user)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>

                      {!user.approved ? (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, { approved: true })} className="cursor-pointer text-emerald-400 hover:bg-emerald-500/10">
                          <UserCheck className="mr-2 h-4 w-4" /> Ativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, { approved: false })} className="cursor-pointer text-amber-400 hover:bg-amber-500/10">
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
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={aiFilter ? 4 : 5} className="h-24 text-center text-white/20 italic">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 bg-white/5 border-white/10 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab !== "BOT" && (
          <Button onClick={() => handleOpenCreate()} className="bg-primary hover:bg-primary/90 text-white gap-2">
            <UserPlus className="h-4 w-4" /> Novo Usuário
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {formData.isAI ? <Bot className="h-5 w-5 text-primary" /> : <UserIcon className="h-5 w-5 text-primary" />}
              {editingUser ? "Editar" : "Criar"} {formData.isAI ? "Agente IA" : "Usuário"}
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Preencha os dados básicos abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={cn("space-y-2", formData.isAI ? "col-span-2" : "col-span-1")}>
                <Label htmlFor="name" className="text-white/60 text-xs uppercase font-bold">Nome</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-black/40 border-white/10 text-white" 
                  required
                />
              </div>

              {!formData.isAI && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/60 text-xs uppercase font-bold">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    disabled={!!editingUser}
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-black/40 border-white/10 text-white" 
                    required
                  />
                </div>
              )}

              {!formData.isAI && (
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white/60 text-xs uppercase font-bold">Perfil</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(v) => setFormData({...formData, role: v})}
                  >
                    <SelectTrigger className="bg-black/40 border-white/10 text-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="USER">Cliente</SelectItem>
                      <SelectItem value="AGENT">Atendente</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.isAI && (
                <>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="aiApiKey" className="text-white/60 text-xs uppercase font-bold">Token / API Key</Label>
                    <Input 
                      id="aiApiKey" 
                      type="password"
                      value={formData.aiApiKey} 
                      onChange={(e) => setFormData({...formData, aiApiKey: e.target.value})}
                      className="bg-black/40 border-white/10 text-white" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="aiModel" className="text-white/60 text-xs uppercase font-bold">Modelo</Label>
                    <Select 
                      value={formData.aiModel || "gemini-1.5-flash"} 
                      onValueChange={(v) => setFormData({...formData, aiModel: v})}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-white">
                        <SelectValue placeholder="Selecione o modelo..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Rápido)</SelectItem>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Poderoso)</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="aiInstructions" className="text-white/60 text-xs uppercase font-bold">Instruções do Sistema</Label>
                    <textarea 
                      id="aiInstructions" 
                      placeholder="Ex: Você é um atendente especializado em SaaS..."
                      value={formData.aiInstructions} 
                      onChange={(e) => setFormData({...formData, aiInstructions: e.target.value})}
                      className="w-full min-h-[120px] bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </>
              )}

              {!formData.isAI && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/60 text-xs uppercase font-bold">Telefone</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept" className="text-white/60 text-xs uppercase font-bold">Departamento</Label>
                    <Input id="dept" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white/60 text-xs uppercase font-bold">Cargo</Label>
                    <Input id="title" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40">Cancelar</Button>
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-8">
                {loading ? "Gravando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="USER" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 p-1 h-12 w-full justify-start gap-2 overflow-x-auto">
          <TabsTrigger value="ADMIN" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2 px-6 font-bold">
            <Shield className="h-4 w-4" /> Admins
          </TabsTrigger>
          <TabsTrigger value="AGENT" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2 px-6 font-bold">
            <UsersIcon className="h-4 w-4" /> Atendentes
          </TabsTrigger>
          <TabsTrigger value="USER" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2 px-6 font-bold">
            <UserIcon className="h-4 w-4" /> Clientes
          </TabsTrigger>
          <TabsTrigger value="BOT" className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2 px-6 font-bold">
            <Bot className="h-4 w-4" /> Agentes (IA)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ADMIN">{renderUserTable("ADMIN")}</TabsContent>
        <TabsContent value="AGENT">{renderUserTable("AGENT")}</TabsContent>
        <TabsContent value="USER">{renderUserTable("USER")}</TabsContent>
        <TabsContent value="BOT">
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleOpenCreate("BOT")} className="bg-amber-500 hover:bg-amber-600 text-black font-black gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Bot className="h-4 w-4" /> Novo Agente IA
            </Button>
          </div>
          {renderUserTable("AGENT", true)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

