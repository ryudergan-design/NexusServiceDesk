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
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (!passwordsMatch) return null
        
        if (!user.approved) {
          throw new Error("Pendente de Aprovação")
        }

        return user
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      if (!user) return token;
      
      token.role = user.role;
      return token;
    }
  },
  pages: {
    signIn: "/auth/login",
  }
})
