import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    reservationId?: string;
};

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== "string") {
        throw new Error("Invalid ID");
    }

    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } }
            ]
        },
    });

    return NextResponse.json(reservation);
}

export async function PUT(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== "string") {
        throw new Error("Invalid ID");
    }

    const body = await request.json();
    const { status } = body;

    // Kiểm tra nếu không có `status` hoặc không hợp lệ
    const validStatuses = ["PENDING", "ACCEPTED", "DECLINED"];
    if (!status || !validStatuses.includes(status)) {
        return NextResponse.json({ status: 400, statusText: "Invalid status" });
    }

    // Chỉ cho phép chủ nhà cập nhật trạng thái
    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { listing: true },
    });

    if (!reservation || reservation.listing.userId !== currentUser.id) {
        return NextResponse.json({ status: 403, statusText: "Forbidden" });
    }

    // Cập nhật trạng thái
    const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: { status },
    });

    return NextResponse.json(updatedReservation);
}
