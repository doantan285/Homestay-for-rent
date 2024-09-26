import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PUT(
    request: Request
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update name' }, { status: 500 });
    }
}