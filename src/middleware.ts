import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const activeRole = (req.auth?.user as any)?.activeRole
  const { nextUrl } = req
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/auth/login", "/auth/register"].includes(nextUrl.pathname)
  const isAuthRoute = ["/auth/login", "/auth/register"].includes(nextUrl.pathname)
  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin")
  
  if (isApiAuthRoute) return undefined
  
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl))
    }
    return undefined
  }
  
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) callbackUrl += nextUrl.search
    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl))
  }

  // Proteção Extra: Se logado como USER (ou modo Solicitante), bloqueia rotas ADMIN
  if (isLoggedIn && isAdminRoute && activeRole === "USER") {
    return Response.redirect(new URL("/dashboard", nextUrl))
  }
  
  return undefined
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

