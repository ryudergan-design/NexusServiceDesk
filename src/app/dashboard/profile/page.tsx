import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { ProfileClient } from "./profile-client"
import { UserCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { AIToggle } from "@/components/settings/AIToggle"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-primary" /> Meu Perfil
        </h1>
        <p className="mt-2 text-muted-foreground">Visualização de suas informações pessoais e de contato.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8">
          <ProfileClient user={user} activeRole={(session.user as any).activeRole} />
        </div>
        <div className="lg:col-span-4">
          <AIToggle initialEnabled={user.aiEnabled} />
        </div>
      </div>
    </div>
  )
}
