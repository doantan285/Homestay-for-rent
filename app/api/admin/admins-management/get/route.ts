import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { SafeAdmin } from '@/app/types';

export async function GET() {
    try {
        const admins = await prisma.admin.findMany();

        const safeAdmins: SafeAdmin[] = admins.map(admin => ({
            ...admin,
            createdAt: admin.createdAt.toISOString(),
            lastLogin: admin.lastLogin ? admin.lastLogin.toISOString() : null,
            lastPasswordUpdated: admin.lastPasswordUpdated ? admin.lastPasswordUpdated.toISOString() : null,
            updatedAt: admin.updatedAt ? admin.updatedAt.toISOString() : null,
        }));

        return NextResponse.json(safeAdmins);
    } catch (error) {
        return NextResponse.error();
    }
}
