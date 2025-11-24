import { NextResponse } from "next/server";

export function middleware(request) {
  // For now, allow all requests to pass through
  // You can add authentication logic here later with Stack Auth
  
  // Example of protected routes (uncomment when Stack Auth is configured):
  /*
  const protectedPaths = ['/dashboard', '/discussion-room'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtectedPath) {
    // Check for authentication token or session
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }
  }
  */
  
  return NextResponse.next();
}

export const config = {
  // Define which routes this middleware should run on
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|handler).*)',
  ],
};