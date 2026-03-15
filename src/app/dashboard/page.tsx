import { auth } from "@/auth"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const session = await auth()
  const activeRole = (session?.user as any)?.activeRole
  const statsData = await getDashboardStats()

  const isUser = activeRole === "USER"

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(8,15,31,0.94)_40%,rgba(3,7,18,1)_100%)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.32)]">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">Dashboard Principal</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {isUser ? "Acompanhe suas solicitações" : "Acompanhe a operação"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              {isUser
                ? "Veja rapidamente o que está aberto, o que depende da sua aprovação e o que já foi concluído."
                : "Monitore volume, andamento, categorias e atividade recente da equipe em um único painel."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: isUser ? "Solicitações" : "Em andamento",
                value: isUser ? `${statsData?.total ?? 0}` : `${statsData?.open ?? 0}`,
              },
              {
                label: isUser ? "Aprovações" : "Categorias",
                value: isUser ? `${statsData?.awaitingApproval ?? 0}` : `${statsData?.categoryStats?.length ?? 0}`,
              },
              {
                label: isUser ? "Concluídos" : "Usuários",
                value: isUser ? `${statsData?.closed ?? 0}` : `${statsData?.users ?? 0}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DashboardClient statsData={statsData} activeRole={activeRole} />
    </div>
  )
}
