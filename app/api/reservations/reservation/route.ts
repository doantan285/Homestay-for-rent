import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.error();
    }

    // Tạo một reservation mới
    try {
        const reservation = await prisma.reservation.create({
            data: {
                userId: currentUser.id,
                listingId,
                startDate,
                endDate,
                totalPrice,
            },
        });

        // Trả về thông tin của reservation vừa tạo
        return NextResponse.json(reservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.error();
    }
}
