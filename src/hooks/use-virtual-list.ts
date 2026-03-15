"use client"

import { useEffect, useRef, useState } from "react"

interface UseVirtualListOptions {
  itemCount: number
  itemHeight: number
  overscan?: number
  enabled?: boolean
}

export function useVirtualList({
  itemCount,
  itemHeight,
  overscan = 4,
  enabled = true,
}: UseVirtualListOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let frameId = 0

    const updateMetrics = () => {
      setScrollTop(container.scrollTop)
      setViewportHeight(container.clientHeight)
    }

    const onScroll = () => {
      cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateMetrics)
    }

    updateMetrics()

    const resizeObserver = new ResizeObserver(updateMetrics)
    resizeObserver.observe(container)
    container.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      container.removeEventListener("scroll", onScroll)
    }
  }, [])

  const totalHeight = itemCount * itemHeight

  if (!enabled) {
    return {
      containerRef,
      totalHeight,
      paddingTop: 0,
      paddingBottom: 0,
      startIndex: 0,
      endIndex: itemCount,
    }
  }

  const safeViewportHeight = viewportHeight || itemHeight * 8
  const visibleCount = Math.ceil(safeViewportHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(itemCount, startIndex + visibleCount + overscan * 2)
  const paddingTop = startIndex * itemHeight
  const paddingBottom = Math.max(0, totalHeight - endIndex * itemHeight)

  return {
    containerRef,
    totalHeight,
    paddingTop,
    paddingBottom,
    startIndex,
    endIndex,
  }
}
