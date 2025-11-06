import { createMiddleware } from "@/lib/create-middleware"

export const middleware = createMiddleware({
  protectedRoutes: [],
  protectedAPIRoutes: [],
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Static assets (images, fonts, videos, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.avif|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.mp4|.*\\.webm|.*\\.avi|.*\\.mov|.*\\.wmv|.*\\.flv|.*\\.mkv).*)",
  ],
}
