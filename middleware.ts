import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export { default } from "next-auth/middleware";

async function verifyToken(token: string, secret: string) {
    try {
        const secretKey = new TextEncoder().encode(secret);
        await jwtVerify(token, secretKey);
        return true;
    } catch (error) {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('admin-token')?.value;

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token || !(await verifyToken(token, process.env.JWT_SECRET!))) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/account",
        "/trips",
        "/reservations",
        "/properties",
        "/favorites",
        "/admin/:path((?!login).*)",
    ],
};
