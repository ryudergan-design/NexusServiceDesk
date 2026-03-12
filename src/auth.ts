import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6),
            accessMode: z.enum(["staff", "user"]).default("user")
          })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password, accessMode } = parsedCredentials.data
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) return null
        
        if (!user.approved) {
          throw new Error("Sua conta ainda não foi aprovada por um administrador.")
        }

        const isStaff = user.role === "ADMIN" || user.role === "AGENT"
        
        // Se tentar logar como staff mas for apenas user, bloqueia
        if (accessMode === "staff" && !isStaff) {
          throw new Error("Você não tem permissão para acessar como atendente.")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          activeRole: accessMode === "staff" ? user.role : "USER"
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.activeRole = (user as any).activeRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
        // @ts-ignore
        session.user.activeRole = token.activeRole as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  }
})
