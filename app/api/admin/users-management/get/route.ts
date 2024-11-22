import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { SafeUser } from '@/app/types';

export async function GET() {
    try {
        const users = await prisma.user.findMany();

        const safeUsers: SafeUser[] = users.map(user => ({
            ...user,
            createdAt: user.createdAt.toISOString(), // Chuyển đổi đối tượng Date sang chuỗi thời gian quốc tế (ISO 8601)
            updatedAt: user.updatedAt.toISOString(),
            emailVerified: user.emailVerified?.toISOString() || null,
            lastPasswordUpdated: user.lastPasswordUpdated?.toISOString() || null
        }));

        return NextResponse.json(safeUsers);
    } catch (error) {
        return NextResponse.error();
    }
}
