import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Đảm bảo prisma được import từ đúng vị trí

interface IParams {
    transactionId: string;
}

export async function PATCH(
    request: Request,
    { params }: { params: IParams }
) {
    const { transactionId } = params;

    // Lấy thông tin giao dịch hiện tại từ cơ sở dữ liệu
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
    });

    if (!transaction) {
        return NextResponse.json({ status: 404, statusText: "Transaction not found" });
    }

    // Lấy status mới từ body request
    const { status } = await request.json();

    // Kiểm tra trạng thái có hợp lệ không
    const validStatuses = ['pending', 'paid', 'refund'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ status: 400, statusText: "Invalid status" });
    }

    // Cập nhật trạng thái giao dịch trong cơ sở dữ liệu
    const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { status },
    });

    return NextResponse.json(updatedTransaction);
}
