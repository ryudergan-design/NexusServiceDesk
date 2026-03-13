"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface HighTechTypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export function HighTechTypewriter({ text, speed = 10, onComplete }: HighTechTypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <div className="relative font-mono text-sm leading-relaxed">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-primary/90"
      >
        {displayedText}
      </motion.span>
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="inline-block w-2 h-4 bg-primary ml-1 align-middle shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        />
      )}
    </div>
  )
}
