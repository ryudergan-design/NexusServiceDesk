import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-black/40 px-3 pb-28 pt-4 sm:px-5 sm:pt-5 md:px-6 md:pb-8 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
        <MobileBottomBar />
      </div>
    </div>
  )
}
