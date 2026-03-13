"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket, Zap, Shield, BarChart, MessageSquare, Cpu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Triagem com IA",
    description: "Classificação automática de categoria e prioridade usando Llama 3.3 e Gemini.",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Busca RAG Local",
    description: "Base de conhecimento inteligente integrada ao SQLite com busca semântica.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Gestão de SLA",
    description: "Controle rigoroso de prazos e notificações em tempo real para sua equipe.",
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Dashboard Analítico",
    description: "Visibilidade total da operação com gráficos de performance e NPS.",
    icon: BarChart,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl -z-10 opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 text-primary py-1 px-4 text-xs font-semibold tracking-wider uppercase">
            v1.1.0 - Inteligência Artificial Integrada
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
        >
          Nexus ServiceDesk
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-lg leading-8 text-white/60 max-w-3xl mx-auto font-medium"
        >
          O sistema de Help Desk moderno que une o poder do ITIL com a inteligência dos Agentes de IA. 
          Resolva chamados mais rápido, automatize a triagem e encante seus usuários.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="h-14 px-8 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all">
            <Link href="/auth/login" className="flex items-center gap-2">
              Acessar Sistema <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold rounded-xl border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <Link href="/auth/register">
              Criar Conta Grátis
            </Link>
          </Button>
        </motion.div>

        {/* Floating App Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 backdrop-blur-2xl shadow-2xl"
        >
          <div className="aspect-[16/9] w-full rounded-xl bg-black/40 overflow-hidden relative border border-white/5 group">
             {/* Mock de Interface */}
             <div className="absolute inset-0 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <Ticket className="h-24 w-24 text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="absolute bottom-0 left-0 right-0 p-8 text-left bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Sistema Ativo</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Interface Dual: Kanban & Softdesk</h3>
                <p className="text-white/60 text-sm mt-2 max-w-xl">Alterne entre visualizações de alta densidade e quadros ágeis com um clique. Performance nativa com Next.js e SQLite.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-5xl text-white">Inteligência que faz a diferença</h2>
          <p className="mt-4 text-white/50 text-lg">Tecnologia de ponta para equipes que não param.</p>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group"
              >
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                  <feature.icon className={cn("h-6 w-6", feature.color)} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center bg-black">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Ticket className="h-5 w-5 text-primary" />
          <span className="font-bold text-white">Nexus ServiceDesk</span>
        </div>
        <p className="text-white/30 text-sm">© 2026 I9 Chamados. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// Helper para concatenar classes sem precisar de lib externa se não houver
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
