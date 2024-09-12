import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUSer = await getCurrentUser();

    if (!currentUSer) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        throw new Error('Invalid ID');
    }

    let favoriteIds = [...(currentUSer.favoriteIds || [])];

    favoriteIds.push(listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUSer.id
        },
        data: {
            favoriteIds
        }
    });

    return NextResponse.json(user);
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUSer = await getCurrentUser();

    if (!currentUSer) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        throw new Error('Invalid ID');
    }

    let favoriteIds = [...(currentUSer.favoriteIds || [])];

    favoriteIds = favoriteIds.filter(id => id !== listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUSer.id
        },
        data: {
            favoriteIds
        }
    });

    return NextResponse.json(user);
}