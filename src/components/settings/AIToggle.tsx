"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Brain, Sparkles, Loader2 } from "lucide-react"
import { updateAIPreference } from "@/lib/actions/users"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface AIToggleProps {
  initialEnabled: boolean
}

export function AIToggle({ initialEnabled }: AIToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setLoading(true)
    try {
      await updateAIPreference(checked)
      setEnabled(checked)
      toast.success(checked ? "Recursos de IA ativados!" : "Recursos de IA desativados.")
    } catch (error) {
      toast.error("Erro ao atualizar preferência de IA.")
      // Revert UI state if action fails
      setEnabled(!checked)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Brain className="h-24 w-24 text-primary" />
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl text-white">Assistência de IA</CardTitle>
          </div>
          <CardDescription className="text-white/40 max-w-[80%]">
            Ative para receber sugestões de respostas, triagem automática e insights inteligentes nos seus chamados.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="space-y-0.5">
              <Label htmlFor="ai-toggle" className="text-base text-white">
                Inteligência Artificial Ativa
              </Label>
              <p className="text-sm text-white/40">
                {enabled ? "A IA está ajudando você agora." : "A IA está pausada para sua conta."}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              <Switch
                id="ai-toggle"
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={loading}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary/70 leading-relaxed">
              <strong>Nota:</strong> Desativar a IA impedirá que você veja o painel de insights e use o Magic Compose nos tickets, mas o sistema continuará processando dados para relatórios gerenciais.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
