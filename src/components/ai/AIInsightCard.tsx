"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Sparkles, BookOpen, ChevronRight, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface AIInsightCardProps {
  ticketId: number
  description: string
}

export function AIInsightCard({ ticketId, description }: AIInsightCardProps) {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<{
    summary: string
    category: string
    priority: string
    articles: { id: string; title: string }[]
  } | null>(null)

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true)
      try {
        // Simulação de delay de processamento da IA
        await new Promise(resolve => setTimeout(resolve, 2000))
        setInsights({
          summary: "O usuário relata erro de autenticação persistente após troca de senha, possivelmente cache de credenciais local.",
          category: "Acessos e Senhas",
          priority: "MEDIUM",
          articles: [
            { id: "1", title: "Limpeza de Cache de Credenciais Windows" },
            { id: "2", title: "Procedimento de Reset de Senha de Domínio" }
          ]
        })
      } catch (error) {
        console.error("Erro ao carregar insights da IA", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [ticketId])

  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle className="text-sm font-medium">Analisando com IA...</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/30 bg-primary/10 backdrop-blur-md overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>

        <CardHeader className="pb-2 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/20">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              IA INSIGHTS
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/70">
              <Lightbulb className="h-3 w-3" />
              SUMÁRIO DA TRIAGEM
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 font-medium">
              {insights?.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
              {insights?.category}
            </Badge>
            <Badge variant="outline" className="border-primary/20">
              {insights?.priority}
            </Badge>
          </div>

          {insights?.articles && (
            <div className="pt-4 border-t border-primary/10 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary/70">
                <BookOpen className="h-3 w-3" />
                ARTIGOS SUGERIDOS
              </div>
              <div className="space-y-2">
                {insights.articles.map((article) => (
                  <button
                    key={article.id}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/20 transition-all text-left text-xs font-medium"
                  >
                    {article.title}
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
