"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

interface TechPowerOverlayProps {
  active: boolean
}

export function TechPowerOverlay({ active }: TechPowerOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-xl"
        >
          {/* Brilho da Borda */}
          <motion.div 
            className="absolute inset-0 border-2 border-primary shadow-[0_0_30px_rgba(59,130,246,0.5)] rounded-xl"
            animate={{ 
              borderColor: ["#3b82f6", "#a855f7", "#3b82f6"],
              boxShadow: [
                "0_0_20px_rgba(59,130,246,0.3)",
                "0_0_40px_rgba(168,85,247,0.6)",
                "0_0_20px_rgba(59,130,246,0.3)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />

          {/* Overlay de Partículas/Scanline */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-purple-500/10 mix-blend-overlay" />
          
          {/* Ícone Central Animado */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              className="bg-primary/20 p-4 rounded-full backdrop-blur-md border border-primary/30"
            >
              <Sparkles className="h-8 w-8 text-primary animate-spin-slow" />
            </motion.div>
          </div>

          {/* Efeito de Varredura (Scan) */}
          <motion.div 
            className="absolute inset-x-0 h-[2px] bg-primary/50 shadow-[0_0_15px_#3b82f6]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
