import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

export async function PUT(request: Request) {

    try {
        const { adminId, newPassword } = await request.json();

        if (!adminId || !newPassword) {
            return NextResponse.json(
                { error: "Admin ID and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const targetAdmin = await prisma.admin.findUnique({
            where: { id: adminId },
        });

        if (!targetAdmin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.admin.update({
            where: { id: adminId },
            data: {
                hashedPassword,
                lastPasswordUpdated: new Date(),
            },
        });

        return NextResponse.json({
            message: "Password updated successfully",
            adminId,
            lastPasswordUpdated: new Date(),
        });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}
