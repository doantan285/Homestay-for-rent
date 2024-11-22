import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
    return await getServerSession(authOptions);
}

export default async function getMessages() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        // Lấy ID người dùng từ session
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if (!currentUser) {
            return null;
        }

        // Truy vấn tất cả các tin nhắn của người dùng (dựa trên senderId và receiverId)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id },
                    { receiverId: currentUser.id }
                ]
            },
            include: {
                sender: true, // Lấy thông tin người gửi
                receiver: true // Lấy thông tin người nhận
            },
            orderBy: {
                createdAt: 'desc' // Sắp xếp theo thời gian gửi tin nhắn (mới nhất lên đầu)
            }
        });

        // Chuyển đổi dữ liệu ngày nếu cần
        const safeMessages = messages.map((message) => ({
            ...message,
            createdAt: message.createdAt.toISOString(), // Chuyển đổi đối tượng Date sang chuỗi thời gian quốc tế (ISO 8601)
            sender: {
                ...message.sender,
                createdAt: currentUser.createdAt.toISOString(), // Chuyển đổi đối tượng Date sang chuỗi thời gian quốc tế (ISO 8601)
                updatedAt: currentUser.updatedAt.toISOString(),
                emailVerified: currentUser.emailVerified?.toISOString() || null,
                lastPasswordUpdated: currentUser.lastPasswordUpdated?.toISOString() || null
            },
            receiver: {
                ...message.receiver,
                createdAt: currentUser.createdAt.toISOString(), // Chuyển đổi đối tượng Date sang chuỗi thời gian quốc tế (ISO 8601)
                updatedAt: currentUser.updatedAt.toISOString(),
                emailVerified: currentUser.emailVerified?.toISOString() || null,
                lastPasswordUpdated: currentUser.lastPasswordUpdated?.toISOString() || null
            }
        }));

        return safeMessages;
    } catch (error: any) {
        console.error("Error fetching messages:", error);
        return null;
    }
}
