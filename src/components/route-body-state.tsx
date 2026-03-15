"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function RouteBodyState() {
  const pathname = usePathname()

  useEffect(() => {
    document.body.dataset.pathname = pathname
    document.body.dataset.mobileDebug = pathname === "/dashboard/admin/users" ? "true" : "false"

    return () => {
      delete document.body.dataset.pathname
      delete document.body.dataset.mobileDebug
    }
  }, [pathname])

  return null
}
