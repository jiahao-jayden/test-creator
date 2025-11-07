import { getCookieCache, getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

interface CreateMiddlewareOptions {
  protectedRoutes: string[]
  protectedAPIRoutes: string[]
}

const ADMIN_ROUTES_PREFIX = "/admin"
const ADMIN_API_ROUTES_PREFIX = "/api/admin"

type RouteType = "public" | "protected" | "admin"

interface RouteInfo {
  type: RouteType
  isAPI: boolean
}

const matchPath = (pathname: string, pattern: string): boolean => {
  if (pattern === pathname) {
    return true
  }

  if (pattern.endsWith("/**")) {
    const prefix = pattern.slice(0, -3)
    return pathname.startsWith(prefix)
  }

  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2)
    const rest = pathname.slice(prefix.length)
    return pathname.startsWith(prefix) && rest.split("/").filter(Boolean).length === 1
  }

  return false
}

const matchRoutes = (pathname: string, routes: string[]): boolean => {
  return routes.some((route) => matchPath(pathname, route))
}

const getRouteInfo = (
  pathname: string,
  protectedRoutes: string[],
  protectedAPIRoutes: string[]
): RouteInfo => {
  const isAPI = matchRoutes(pathname, protectedAPIRoutes) || pathname.startsWith("/api")

  if (pathname.startsWith(ADMIN_API_ROUTES_PREFIX) || pathname.startsWith(ADMIN_ROUTES_PREFIX)) {
    return { type: "admin", isAPI }
  }

  if (matchRoutes(pathname, protectedRoutes) || matchRoutes(pathname, protectedAPIRoutes)) {
    return { type: "protected", isAPI }
  }

  return { type: "public", isAPI }
}

const createUnauthorizedResponse = (isAPI: boolean, redirectUrl: URL) => {
  if (isAPI) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.redirect(redirectUrl)
}

const isAdmin = (email: string | undefined): boolean => {
  if (!email) return false
  const adminEmailList = process.env.ADMIN_EMAIL?.split(",").map((e) => e.trim())
  return adminEmailList?.includes(email) ?? false
}

export const createMiddleware = (options: CreateMiddlewareOptions) => {
  const { protectedRoutes, protectedAPIRoutes } = options

  return async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const { type: routeType, isAPI } = getRouteInfo(pathname, protectedRoutes, protectedAPIRoutes)

    if (routeType === "public") {
      return NextResponse.next()
    }

    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
      const redirectUrl =
        routeType === "protected" ? new URL("/login", request.url) : new URL("/", request.url)
      return createUnauthorizedResponse(isAPI, redirectUrl)
    }

    if (routeType === "admin") {
      const session = await getCookieCache(request, {
        secret: process.env.BETTER_AUTH_SECRET,
      })

      if (!session || !isAdmin(session?.user.email)) {
        if (isAPI) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    return NextResponse.next()
  }
}
