"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bot, Zap, ShieldCheck, RefreshCw } from "lucide-react"

interface HighTechStatusTransitionProps {
  active: boolean
  status: string
}

const statusIcons: Record<string, any> = {
  TRIAGE: Zap,
  DEVELOPMENT: RefreshCw,
  COMPLETED: ShieldCheck,
  PENDING_USER: Bot,
}

export function HighTechStatusTransition({ active, status }: HighTechStatusTransitionProps) {
  const Icon = statusIcons[status] || Zap

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Fundo de Distorção */}
          <motion.div 
            className="absolute inset-0 bg-primary/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Círculos de Energia */}
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 rounded-full border-4 border-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.5)]"
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-purple-500/30"
              animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Ícone e Texto */}
            <div className="relative bg-slate-950 p-10 rounded-full border border-white/10 flex flex-col items-center gap-4">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Icon className="h-12 w-12 text-primary" />
              </motion.div>
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Status Update</span>
                <span className="text-xl font-black text-white italic tracking-tighter">{status}</span>
              </div>
              
              {/* Scanline local */}
              <motion.div 
                className="absolute inset-x-0 h-1 bg-primary/50"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Scanlines Globais */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_4px,3px_100%]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
