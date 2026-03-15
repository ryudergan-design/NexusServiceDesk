import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")
  const isPublicRoute = nextUrl.pathname === "/" || isAuthRoute || isApiAuthRoute
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

  return undefined
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

