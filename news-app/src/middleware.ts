import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/profile']
const authPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionToken = request.cookies.get('sessionToken')
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/profile',
    ],
}