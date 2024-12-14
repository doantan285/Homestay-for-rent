import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID');
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}

export async function PUT(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;
    const body = await request.json();
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        province,
        district,
        ward,
        iframe,
        price,
        replacementPrice
    } = body;

    if (!listingId) {
        return NextResponse.error();
    }

    const updatedListing = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            province,
            district,
            ward,
            iframe,
            price: parseInt(price, 10),
            replacementPrice: parseInt(replacementPrice, 10),
            userId: currentUser.id
        },
    });

    return NextResponse.json(updatedListing);
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { listingId } = params;

        if (!listingId || typeof listingId !== 'string') {
            return NextResponse.error();
        }

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        });

        if (!listing) {
            return NextResponse.error();
        }

        return NextResponse.json({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null
            }
        });
    } catch (error: any) {
        console.error('Error fetching listing:', error);
        return NextResponse.error();
    }
}