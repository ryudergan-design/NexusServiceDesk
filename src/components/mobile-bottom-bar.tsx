"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { LayoutDashboard, PlusSquare, Ticket, UserCircle, Users } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"

const STAFF_ITEMS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, match: (path: string) => path === "/dashboard" },
  {
    href: "/dashboard/tickets",
    label: "Chamados",
    icon: Ticket,
    match: (path: string) => path.startsWith("/dashboard/tickets") && !path.includes("/new"),
  },
  { href: "/dashboard/tickets/new", label: "Novo", icon: PlusSquare, match: (path: string) => path === "/dashboard/tickets/new" },
  {
    href: "/dashboard/admin/users",
    label: "Usuários",
    icon: Users,
    match: (path: string) => path.startsWith("/dashboard/admin/users"),
    adminOnly: true,
  },
  { href: "/dashboard/profile", label: "Perfil", icon: UserCircle, match: (path: string) => path.startsWith("/dashboard/profile") },
]

const USER_ITEMS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, match: (path: string) => path === "/dashboard" },
  {
    href: "/dashboard/tickets?view=my_open",
    label: "Chamados",
    icon: Ticket,
    match: (path: string, view: string | null) => path.startsWith("/dashboard/tickets") && view !== "my_closed",
  },
  { href: "/dashboard/tickets/new", label: "Novo", icon: PlusSquare, match: (path: string) => path === "/dashboard/tickets/new" },
  { href: "/dashboard/profile", label: "Perfil", icon: UserCircle, match: (path: string) => path.startsWith("/dashboard/profile") },
]

export function MobileBottomBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const user = session?.user as any
  const activeRole = user?.activeRole || "USER"
  const isAdmin = user?.role === "ADMIN"
  const currentView = searchParams.get("view")

  const rawItems = activeRole === "USER" ? USER_ITEMS : STAFF_ITEMS
  const items = rawItems.filter((item) => !("adminOnly" in item) || !item.adminOnly || isAdmin)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden">
      <div className="pointer-events-auto rounded-[1.6rem] border border-cyan-400/15 bg-[#07111f]/90 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="grid auto-cols-fr grid-flow-col gap-2">
          {items.map((item) => {
            const active = item.match(pathname, currentView)
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "group flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-center transition-all",
                  active
                    ? "bg-cyan-400/12 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.22)]"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-transform group-active:scale-95", active && "drop-shadow-[0_0_10px_rgba(34,211,238,0.35)]")} />
                <span className="truncate text-[10px] font-black uppercase tracking-[0.16em]">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
