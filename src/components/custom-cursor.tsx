"use client"

import React, { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Molas com diferentes pesos para criar inércia orgânica
  const springFast = { damping: 20, stiffness: 300, mass: 0.5 }
  const springSlow = { damping: 15, stiffness: 150, mass: 0.8 }
  
  const mainX = useSpring(cursorX, springFast)
  const mainY = useSpring(cursorY, springFast)
  const outerX = useSpring(cursorX, springSlow)
  const outerY = useSpring(cursorY, springSlow)

  useEffect(() => {
    setMounted(true)
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setCoords({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a')
      
      setIsHovering(!!isInteractive)
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseleave", () => setIsVisible(false))
    document.addEventListener("mouseenter", () => setIsVisible(true))

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [isVisible, cursorX, cursorY])

  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block overflow-hidden">
      {/* 1. Coordenadas HUD */}
      <motion.div
        className="fixed font-mono text-[8px] text-primary/40 flex flex-col gap-0 leading-none"
        style={{
          x: cursorX,
          y: cursorY,
          left: 25,
          top: 25,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <span>X:{coords.x}</span>
        <span>Y:{coords.y}</span>
        <span className="mt-1 text-[6px] tracking-widest uppercase opacity-50">System.Ready</span>
      </motion.div>

      {/* 2. Ponteiro Central High-Tech (Arrow -> Hand) */}
      <motion.div
        className="fixed z-20"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: isHovering ? "-30%" : "-15%",
          translateY: isHovering ? "-10%" : "-15%",
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
        >
          <AnimatePresence mode="wait">
            {!isHovering ? (
              // Seta Cibernética (Default)
              <motion.path
                key="arrow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                d="M3 3L10 21L13 13L21 10L3 3Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.1)"
              />
            ) : (
              // Mão Robótica (Hover)
              <motion.path
                key="hand"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                d="M12 11V3M12 3L9 6M12 3L15 6M9 11V17C9 18.6569 10.3431 20 12 20C13.6569 20 15 18.6569 15 17V11M7 13V16M17 13V16"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* 3. Anéis Rotativos (Mantidos) */}
      <motion.div
        className="fixed rounded-full border border-dashed border-primary/40"
        style={{
          x: mainX,
          y: mainY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 50 : 30,
          height: isHovering ? 50 : 30,
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />

      <motion.div
        className="fixed rounded-full border border-primary/20"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 65 : 45,
          height: isHovering ? 65 : 45,
        }}
        animate={{ 
          rotate: -360,
          scale: isClicking ? 0.8 : 1
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 12, ease: "linear" },
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
      />

      {/* 4. Cantos de Enquadramento */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed"
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
              width: 80,
              height: 80,
            }}
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Glow de Fundo */}
      <motion.div
        className="fixed h-48 w-48 rounded-full bg-primary/5 blur-[60px]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  )
}
