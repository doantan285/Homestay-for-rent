import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    userId: string;
}

export async function PATCH(
    request: Request,
    { params }: { params: IParams }
) {
    const { userId } = params;
    
    // Lấy thông tin user hiện tại
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return NextResponse.json({ status: 404, statusText: 'User not found' });
    }

    // Cập nhật trạng thái isLocked ngược lại (toggle)
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isLocked: !user.isLocked }
    });

    return NextResponse.json(updatedUser);
}
