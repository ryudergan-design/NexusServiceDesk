import { getUsers } from "@/lib/actions/users"
import { UsersClient } from "./users-client"
import { Shield } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" /> Gestão de Usuários
        </h1>
        <p className="mt-2 text-muted-foreground">Aprovação de acesso e controle de permissões (RBAC).</p>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  )
}
