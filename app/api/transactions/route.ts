import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();

    const {
        transactionId,
        amount,
        serviceFeeRate,
        reservationId,
        paymentMethod
    } = body;

    if (!transactionId || !amount || !reservationId || !paymentMethod) {
        return NextResponse.error();
    }

    const serviceFee = Math.round((amount * serviceFeeRate) / 100);
    const payOut = amount - serviceFee;

    try {
        const transaction = await prisma.transaction.create({
            data: {
                paypalTransactionId: transactionId,
                reservationId,
                amount,
                serviceFee,
                serviceFeeRate,
                payOut,
                paymentMethod,
                status: "pending",
            },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Error saving transaction:", error);
        return NextResponse.error();
    }
}

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                reservation: true, // Bao gồm thông tin đặt phòng
            },
        });

        return NextResponse.json(
            transactions.map((transaction) => ({
                ...transaction,
                createdAt: transaction.createdAt.toISOString(),
            }))
        );
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.error();
    }
}

export async function PATCH(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { transactionId, status } = body;

    if (!transactionId || !status) {
        return NextResponse.error();
    }

    try {
        const updatedTransaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: { status },
        });

        return NextResponse.json({
            ...updatedTransaction,
            createdAt: updatedTransaction.createdAt.toISOString(),
        });
    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.error();
    }
}
