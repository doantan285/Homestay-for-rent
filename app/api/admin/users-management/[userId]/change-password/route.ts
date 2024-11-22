import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

interface IParams {
    userId: string;
}

export async function PUT(
    request: Request,
    { params }: { params: IParams }
) {
    const { userId } = params;
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
            { error: "Password must be at least 8 characters long" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { hashedPassword },
        });

        return NextResponse.json({
            message: "Password updated successfully",
            userId: updatedUser.id,
        });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
