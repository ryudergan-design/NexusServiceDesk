"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { getMagicComposeAction } from '@/lib/actions/ai'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"

interface MagicComposeProps {
  ticketId?: string
  text: string
  contextType: 'NEW_TICKET' | 'REPLY'
  onCompose: (suggestion: string) => void
  onStart?: () => void
  onEnd?: () => void
  disabled?: boolean
  category?: string
  type?: string
  impact?: string
  urgency?: string
}

export function MagicCompose({ 
  ticketId, 
  text, 
  contextType, 
  onCompose, 
  onStart,
  onEnd,
  disabled,
  category,
  type,
  impact,
  urgency 
}: MagicComposeProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const canGenerate = contextType === 'NEW_TICKET' 
    ? text.trim().length > 0 
    : text.trim().length >= 20

  const handleCompose = async () => {
    if (!canGenerate) {
      if (contextType === 'NEW_TICKET') {
        toast.error('Informe um título para gerar a descrição.')
      } else {
        toast.error('Digite pelo menos 20 caracteres para refinamento.')
      }
      return
    }

    setIsLoading(true)
    if (onStart) onStart()

    try {
      const result = await getMagicComposeAction({
        text,
        contextType,
        ticketId,
        category,
        type,
        impact,
        urgency
      })
      
      if (result.solution) {
        // Efeito de "Poder Tecnológico" por 1.5s
        setTimeout(() => {
          onCompose(result.solution)
          setIsLoading(false)
          if (onEnd) onEnd()
          toast.success('IA: Texto refinado com sucesso!')
        }, 1500)
      } else {
        setIsLoading(false)
        if (onEnd) onEnd()
      }
    } catch (error: any) {
      toast.error('Erro na conexão com IA.')
      setIsLoading(false)
      if (onEnd) onEnd()
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCompose}
      disabled={isLoading || disabled}
      className={cn(
        "flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20 hover:border-primary/50 text-xs font-bold uppercase tracking-widest transition-all h-9",
        !canGenerate && "opacity-50 grayscale cursor-not-allowed"
      )}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
      ) : (
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      )}
      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {isLoading ? 'Processando...' : 'Magic Compose'}
      </span>
    </Button>
  )
}
