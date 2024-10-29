import { NextApiRequest } from "next";
import prisma from "@/app/libs/prismadb";
import { verify } from "jsonwebtoken";

export default async function getCurrentAdmin(req: NextApiRequest) {
    const token = req.cookies.token;
    console.log('Token:', token);
    if (!token) {
        return null;
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET as string);

        if (typeof decoded === "string") {
            return null;
        }

        const adminId = decoded.id;

        const currentAdmin = await prisma.admin.findUnique({
            where: {
                id: adminId,
            },
        });

        return {
            ...currentAdmin,
            createdAt: currentAdmin?.createdAt.toISOString(),
            lastLogin: currentAdmin?.lastLogin?.toISOString() || null,
        };
    } catch (error) {
        console.error('Error retrieving current admin:', error);
        return null;
    }
}