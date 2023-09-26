import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {  
  if (request.nextUrl.pathname.includes('blog-static/_next/static')) {
    return NextResponse.rewrite(
      request.nextUrl.href.replace('/blog-static/_next', '/_next')
    )
  }
  if (request.nextUrl.pathname.includes('blog-static/_next/data')) {
    return NextResponse.rewrite(
      request.nextUrl.href.replace('/blog-static/_next', '/_next')
    )
  }
}