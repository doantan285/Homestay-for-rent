import { cookies } from "next/headers";
import prisma from "@/app/libs/prismadb";
import { jwtVerify } from "jose";

export default async function getCurrentAdmin() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("admin-token")?.value;

        if (!token || !process.env.JWT_SECRET) {
            return null;
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const adminId = payload.id as string;
        
        const currentAdmin = await prisma.admin.findUnique({
            where: { id: adminId },
        });

        if (!currentAdmin) {
            return null;
        }

        return {
            ...currentAdmin,
            createdAt: currentAdmin.createdAt.toISOString(),
            lastLogin: currentAdmin.lastLogin?.toISOString() || null,
            lastPasswordUpdated: currentAdmin.lastPasswordUpdated?.toISOString() || null,
            updatedAt: currentAdmin.updatedAt?.toISOString() || null,
        };
    } catch (error) {
        console.error("Error fetching admin:", error);
        return null;
    }
}