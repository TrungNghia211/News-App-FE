import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import http from '@/lib/http';

const privatePaths = ['/profile', '/admin'];
const authPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('sessionToken');
    // const decoded = jwt.decode(sessionToken);
    // console.log(decoded)
    // const response = await http.get<any>(`/api/users/${decoded.user_id}/`);

    if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken)
        return NextResponse.redirect(new URL('/login', request.url));

    // if (privatePaths.some((path) => pathname.startsWith(path)) && !response.payload.is_staff)
    //     return NextResponse.redirect(new URL('/', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/profile',
        '/admin/:path*',
    ],
}