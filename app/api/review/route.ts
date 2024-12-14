import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        
        // Check if user is authenticated
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { listingId, rating, comment } = await request.json();

        // Validate input data
        if (!listingId || !rating || rating < 1 || rating > 5 || !comment) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }

        // Create a new review in the database
        const review = await prisma.review.create({
            data: {
                userId: currentUser.id,
                listingId: listingId,
                rating: rating,
                comment: comment,
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const listingId = url.searchParams.get('listingId');

        if (!listingId) {
            return NextResponse.json({ message: 'Listing ID is required' }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { listingId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeReviews = reviews.map((review) => ({
            ...review,
            user: {
                id: review.user.id,
                name: review.user.name,
                image: review.user.image,
            },
            createdAt: review.createdAt.toISOString(),
        }));

        return NextResponse.json(safeReviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
