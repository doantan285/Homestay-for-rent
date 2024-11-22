import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: currentUser.id },
                { receiverId: currentUser.id },
            ],
        },
        orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { receiverId, message } = body;

    if (!receiverId || !message.trim()) {
        return NextResponse.error();
    }

    const newMessage = await prisma.message.create({
        data: {
            senderId: currentUser.id,
            receiverId,
            message,
        },
    });

    return NextResponse.json(newMessage);
}
