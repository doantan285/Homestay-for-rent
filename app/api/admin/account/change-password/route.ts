import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";

export async function PUT(
    request: Request
) {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
        return NextResponse.error();
    }

    try {
        const { currentPassword, newPassword, confirmNewPassword } = await request.json();

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return NextResponse.json({ error: "All password fields are required" }, { status: 400 });
        }

        if (newPassword !== confirmNewPassword) {
            return NextResponse.json({ error: "New password and confirm password do not match" }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: {
                id: currentAdmin.id
            }
        });

        if (!admin || !admin.hashedPassword) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        const isCorrectPassword = await bcrypt.compare(currentPassword, admin.hashedPassword);
        if (!isCorrectPassword) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.admin.update({
            where: {
                id: currentAdmin.id
            },
            data: {
                hashedPassword,
                lastPasswordUpdated: new Date()
            }
        });

        return NextResponse.json({ message: "Password updated successfully", lastPasswordUpdate: new Date() });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }
}