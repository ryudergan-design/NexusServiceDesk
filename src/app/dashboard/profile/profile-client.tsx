"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Building2, Briefcase, Mail, Save } from "lucide-react"
import { updateProfile } from "@/lib/actions/users"
import { toast } from "sonner"

interface ProfileClientProps {
  user: any
  activeRole: string
}

export function ProfileClient({ user, activeRole }: ProfileClientProps) {
  const [loading, setLoading] = useState(false)
  const isReadOnly = activeRole === "USER"
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    department: user.department || "",
    jobTitle: user.jobTitle || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isReadOnly) return
    
    setLoading(true)
    try {
      await updateProfile(formData)
      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      toast.error("Erro ao atualizar perfil.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-black text-2xl font-bold text-white uppercase">
                {user.name?.substring(0, 2)}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-white">{user.name}</CardTitle>
              <CardDescription className="text-white/40">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/60">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-white/20" />
                  <Input 
                    id="name"
                    disabled={isReadOnly}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/60">Telefone / WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-white/20" />
                  <Input 
                    id="phone"
                    disabled={isReadOnly}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-white/60">Departamento</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-white/20" />
                  <Input 
                    id="department"
                    disabled={isReadOnly}
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-white/60">Cargo Atual</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-white/20" />
                  <Input 
                    id="jobTitle"
                    disabled={isReadOnly}
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            {!isReadOnly && (
              <div className="pt-4 border-t border-white/5">
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                  <Save className="h-4 w-4" /> {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            )}
            
            {isReadOnly && (
              <div className="pt-4 border-t border-white/5 text-center">
                <p className="text-[10px] text-white/20 italic uppercase tracking-widest">
                  Edição desativada para solicitantes.
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
