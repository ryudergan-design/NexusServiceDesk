import { getDashboardStats } from "@/lib/actions/dashboard"
import { DashboardClient } from "./dashboard-client"
import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()
  const activeRole = (session?.user as any)?.activeRole
  const statsData = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Principal</h1>
        <p className="mt-2 text-muted-foreground">
          {activeRole === "USER" 
            ? "Acompanhe o status de suas solicitações em tempo real." 
            : "Estatísticas em tempo real do Service Desk."}
        </p>
      </div>

      <DashboardClient statsData={statsData} activeRole={activeRole} />
    </div>
  )
}
