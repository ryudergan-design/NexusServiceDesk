"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Bot, Cpu, Sparkles, Waves } from "lucide-react"

interface AIAssignmentSequenceProps {
  active: boolean
  agentName?: string
}

const sequenceSteps = [
  "Sincronizando contexto do chamado",
  "Carregando base operacional",
  "Vinculando agente especializado",
]

export function AIAssignmentSequence({ active, agentName }: AIAssignmentSequenceProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[220] overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_30%),linear-gradient(180deg,rgba(2,6,23,0.72),rgba(2,6,23,0.9))]" />

          <motion.div
            className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,0.18),transparent_35%,rgba(14,116,144,0.14))]"
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative flex h-64 w-64 items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/30"
                animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.85, 0.35] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-6 rounded-full border border-sky-300/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-10 rounded-full bg-cyan-400/10 blur-2xl"
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-14 rounded-full border border-cyan-200/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-slate-950/75 shadow-[0_0_60px_rgba(34,211,238,0.32)] backdrop-blur-xl">
                <Bot className="h-12 w-12 text-cyan-300" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="absolute bottom-8 left-8 w-[min(420px,calc(100vw-2rem))] rounded-[28px] border border-cyan-400/20 bg-slate-950/80 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
                  <Cpu className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300/70">
                    Vinculando IA
                  </p>
                  <p className="text-sm font-bold text-white">
                    {agentName || "Especialista Nexus"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                <Waves className="h-3.5 w-3.5" />
                Online
              </div>
            </div>

            <div className="space-y-3">
              {sequenceSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.25, x: -12 }}
                  animate={{ opacity: [0.35, 1, 0.55], x: 0 }}
                  transition={{ duration: 1.2, delay: index * 0.18, repeat: Infinity, repeatDelay: 0.8 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2"
                >
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                    <motion.div
                      className="absolute h-3 w-3 rounded-full bg-cyan-300/40"
                      animate={{ scale: [0.7, 1.35, 0.7], opacity: [0.25, 0.8, 0.25] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.15 }}
                    />
                    <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/80">{step}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-full border border-cyan-400/15 bg-white/[0.04]">
              <motion.div
                className="h-1.5 bg-[linear-gradient(90deg,rgba(34,211,238,0.15),rgba(56,189,248,0.95),rgba(125,211,252,0.4))]"
                initial={{ x: "-100%" }}
                animate={{ x: ["-100%", "0%", "100%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
