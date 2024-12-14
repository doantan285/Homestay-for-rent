import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
    reviewId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { reviewId } = params;

    if (!reviewId || typeof reviewId !== 'string') {
        throw new Error('Invalid ID');
    }

    const review = await prisma.review.deleteMany({
        where: {
            id: reviewId,
            userId: currentUser.id
        }
    });

    return NextResponse.json(review);
}