import { Review } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function DELETE(request: Request, { params }: { params: { reviewId: string } }) {
    const { reviewId } = params;

    try {
        await prisma.review.delete({
            where: {
                id: reviewId,
            },
        });
        return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}
