import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";

export async function PUT(
    request: Request
) {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        const updatedAdmin = await prisma.admin.update({
            where: {
                id: currentAdmin.id
            },
            data: {
                image: image
            },
        });

        return NextResponse.json(updatedAdmin);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
    }
}