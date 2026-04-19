import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Si no hay sesión y no estamos en la página de login, redirigir a login
    if (!session && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/api') && req.nextUrl.pathname !== '/' && !req.nextUrl.pathname.endsWith('.html')) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirigir al dashboard si ya hay sesión y estamos en login
    if (session && req.nextUrl.pathname.startsWith('/login')) {
      const url = req.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  } catch (e) {
    console.error('Middleware Supabase Error:', e)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - marketplace.html
     */
    '/((?!_next/static|_next/image|favicon.ico|marketplace.html).*)',
  ],
}
