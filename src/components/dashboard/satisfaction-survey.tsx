"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, MessageSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SatisfactionSurveyProps {
  ticketId: string | number
  existingSurvey?: { rating: number; feedback?: string | null } | null
  onSuccess?: () => void
  isPopup?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SatisfactionSurvey({ 
  ticketId, 
  existingSurvey, 
  onSuccess, 
  isPopup = false,
  open,
  onOpenChange 
}: SatisfactionSurveyProps) {
  const [rating, setRating] = useState<number>(existingSurvey?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState(existingSurvey?.feedback || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const isSubmitted = !!existingSurvey

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          feedback,
          comment: `Avaliação do Cliente enviada: ${rating} Estrelas.`
        })
      })

      if (res.ok) {
        toast.success("Obrigado por sua avaliação!")
        if (onSuccess) onSuccess()
        if (onOpenChange) onOpenChange(false)
        router.refresh()
      }
    } catch (error) {
      toast.error("Erro ao enviar avaliação.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReopen = async () => {
    if (confirm("Deseja reabrir este chamado? Ele voltará para a triagem técnica.")) {
      setIsSubmitting(true)
      try {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "TRIAGE",
            comment: "O cliente reabriu o chamado por considerar o problema não resolvido."
          })
        })

        if (res.ok) {
          toast.success("Chamado reaberto.")
          if (onOpenChange) onOpenChange(false)
          router.refresh()
        }
      } catch (error) {
        toast.error("Erro ao reabrir.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const content = (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-white/50">
          {isSubmitted 
            ? "Agradecemos o seu feedback! Ele nos ajuda a melhorar continuamente." 
            : "Sua opinião é fundamental para avaliarmos a solução apresentada."}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={isSubmitted}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110 disabled:hover:scale-100"
            onMouseEnter={() => !isSubmitted && setHoveredRating(star)}
            onMouseLeave={() => !isSubmitted && setHoveredRating(0)}
            onClick={() => !isSubmitted && setRating(star)}
          >
            <Star 
              className={`w-10 h-10 transition-colors duration-300 ${
                (hoveredRating || rating) >= star 
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                  : "fill-transparent text-white/20"
              }`} 
            />
          </button>
        ))}
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" /> Comentários Adicionais
            </label>
            <Textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="O que podemos melhorar?"
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold"
            >
              {isSubmitting ? "Enviando..." : "Confirmar Avaliação"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReopen}
              disabled={isSubmitting}
              className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Não Resolvido
            </Button>
          </div>
        </div>
      ) : (
        existingSurvey?.feedback && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/80 italic">"{existingSurvey.feedback}"</p>
          </div>
        )
      )}
    </div>
  )

  if (isPopup) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" /> Avaliar Atendimento
            </DialogTitle>
            <DialogDescription className="text-white/40 text-xs">
              Ticket #{ticketId}
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-black/40 border border-white/10 shadow-2xl backdrop-blur-xl"
    >
      <h3 className="text-xl font-bold text-white text-center mb-4">Qualidade do Atendimento</h3>
      {content}
    </motion.div>
  )
}
