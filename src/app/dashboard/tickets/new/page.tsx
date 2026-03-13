"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  Upload, 
  X, 
  AlertCircle,
  Loader2,
  FileText,
  HelpCircle,
  Settings,
  Bug,
  Lightbulb,
  Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CollectionChat } from "@/components/ai/CollectionChat"
import { MagicCompose } from "@/components/ai/MagicCompose"
import { TechPowerOverlay } from "@/components/ui/tech-power-overlay"
import { useSession } from "next-auth/react"
import { useRef } from "react"

const ticketSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string().optional(),
  impact: z.string(),
  urgency: z.string(),
})

type TicketFormValues = z.infer<typeof ticketSchema>

// ... inside NewTicketPage ...
export default function NewTicketPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showAICollection, setShowAICollection] = useState(false)
  const [pendingData, setPendingData] = useState<TicketFormValues | null>(null)
  const [isPowerActive, setIsPowerActive] = useState(false)
  
  const isSubmitting = useRef(false)

  const user = session?.user as any
  const aiEnabled = user?.aiEnabled ?? true

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      type: "INCIDENT",
      impact: "LOW",
      urgency: "LOW",
      description: "",
    }
  })

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const onCategoryChange = (id: string) => {
    const cat = categories.find(c => c.id === id)
    setSelectedCategory(cat)
    setValue("categoryId", id)
    setValue("subcategoryId", "")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const submitTicket = async (data: TicketFormValues, additionalInfo?: string) => {
    if (isSubmitting.current) return
    isSubmitting.current = true
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      if (additionalInfo) {
        // Concatenar informações adicionais da IA na descrição
        const currentDesc = data.description
        formData.set("description", `${currentDesc}\n\n--- INFORMAÇÕES ADICIONAIS (COLETA IA) ---\n${additionalInfo}`)
      }

      attachments.forEach(file => {
        formData.append("attachments", file)
      })

      const response = await fetch("/api/tickets", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        router.push("/dashboard/tickets")
      } else {
        isSubmitting.current = false
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      isSubmitting.current = false
      setIsLoading(false)
    } finally {
      // Don't reset isSubmitting here to prevent double clicks during navigation
      setShowAICollection(false)
    }
  }

  const onSubmit = async (data: TicketFormValues) => {
    if (aiEnabled) {
      setPendingData(data)
      setShowAICollection(true)
    } else {
      await submitTicket(data)
    }
  }

  const handleAIComplete = async (additionalInfo: string) => {
    if (pendingData) {
      await submitTicket(pendingData, additionalInfo)
    }
  }

  const handleAISkip = async () => {
    if (pendingData) {
      await submitTicket(pendingData)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <X className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-white">Abrir Novo Chamado</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Descreva o que está acontecendo com o máximo de detalhes possível.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de Chamado</Label>
                <Select onValueChange={(v) => setValue("type", v)} defaultValue="INCIDENT">
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCIDENT">Incidente (Algo quebrou)</SelectItem>
                    <SelectItem value="REQUEST">Requisição (Novo pedido)</SelectItem>
                    <SelectItem value="BUG">Bug (Erro no sistema)</SelectItem>
                    <SelectItem value="SUGGESTION">Sugestão / Melhoria</SelectItem>
                    <SelectItem value="QUESTION">Dúvida / Ajuda Técnica</SelectItem>
                    <SelectItem value="ACCESS">Acesso / Permissões</SelectItem>
                    <SelectItem value="PROJECT">Projeto / Implantação</SelectItem>
                    <SelectItem value="FINANCIAL">Financeiro / Cobrança</SelectItem>
                    <SelectItem value="MAINTENANCE">Manutenção Preventiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select onValueChange={onCategoryChange}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título do Chamado</Label>
              <Input 
                id="title" 
                {...register("title")} 
                placeholder="Ex: Não consigo emitir nota fiscal" 
                className="bg-white/5 border-white/10"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Descrição Detalhada</Label>
                <MagicCompose 
                  text={watch("title") || ""}
                  contextType="NEW_TICKET"
                  category={categories.find(c => c.id === watch("categoryId"))?.name}
                  type={watch("type")}
                  impact={watch("impact")}
                  urgency={watch("urgency")}
                  onStart={() => setIsPowerActive(true)}
                  onEnd={() => setIsPowerActive(false)}
                  onCompose={(v) => setValue("description", v)}
                />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <TechPowerOverlay active={isPowerActive} />
                <RichTextEditor 
                  value={watch("description") || ""} 
                  onChange={(v) => setValue("description", v, { shouldValidate: true })}
                  placeholder="Descreva o passo a passo para reproduzir o problema..." 
                />
              </div>
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Priorização (ITIL)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Impacto</Label>
                <Select onValueChange={(v) => setValue("impact", v)} defaultValue="LOW">
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixo</SelectItem>
                    <SelectItem value="MEDIUM">Médio</SelectItem>
                    <SelectItem value="HIGH">Alto</SelectItem>
                    <SelectItem value="CRITICAL">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Urgência</Label>
                <Select onValueChange={(v) => setValue("urgency", v)} defaultValue="LOW">
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="CRITICAL">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Anexos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-white/30" />
                    <p className="mb-2 text-sm text-white/50"><span className="font-semibold">Clique para enviar</span> ou arraste</p>
                    <p className="text-xs text-white/30">PNG, JPG ou PDF (Máx. 20MB total)</p>
                  </div>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div className="space-y-2">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70 truncate max-w-[200px]">{file.name}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Chamado"}
          </Button>
        </div>
      </form>

      {showAICollection && pendingData && (
        <CollectionChat
          isOpen={showAICollection}
          onClose={() => setShowAICollection(false)}
          onComplete={handleAIComplete}
          onSkip={handleAISkip}
          ticketData={{
            title: pendingData.title,
            description: pendingData.description,
            categoryId: pendingData.categoryId
          }}
        />
      )}
    </div>
  )
}
