"use client"

import { motion } from "framer-motion"
import { Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIPowerEffectProps {
  isActive: boolean
  className?: string
}

export function AIPowerEffect({ isActive, className }: AIPowerEffectProps) {
  if (!isActive) return null

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Glow pulsante na borda */}
      <motion.div 
        className="absolute inset-0 border border-primary/50 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          borderColor: ["rgba(59,130,246,0.3)", "rgba(168,85,247,0.5)", "rgba(59,130,246,0.3)"] 
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />

      {/* Scanline tecnológica */}
      <motion.div 
        className="absolute inset-x-0 h-[1px] bg-primary/20 shadow-[0_0_10px_#3b82f6]"
        animate={{ top: ["-10%", "110%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />

      {/* Partículas sutis */}
      <div className="absolute top-1 right-1">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles className="h-3 w-3 text-primary/40" />
        </motion.div>
      </div>

      {/* Efeito de carregamento de dados (Matrix-like light) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-20" />
    </div>
  )
}
