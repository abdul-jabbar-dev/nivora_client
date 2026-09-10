import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ENV } from './lib/env'

export async function proxy(request: NextRequest) {
  // Admin dashboard protection
  const adminSession = request.cookies.get('admin_session')
  const isAdminAuthenticated = adminSession?.value === 'true'

  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    if (!isAdminAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      const response = NextResponse.redirect(url)
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }
  }

  if (request.nextUrl.pathname === '/admin/login') {
    if (isAdminAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      const response = NextResponse.redirect(url)
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }
  }

  // If this is an admin route and passed checks, proceed without Supabase auth
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // protected customer routes
  const protectedRoutes = ['/profile', '/orders', '/watchlist']
  
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
