import { NextResponse } from "next/server";

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
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const updatedAdmin = await prisma.admin.update({
            where: {
                id: currentAdmin.id
            },
            data: {
                name: name
            },
        });

        return NextResponse.json(updatedAdmin);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update name' }, { status: 500 });
    }
}