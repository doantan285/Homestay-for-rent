import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
    return await getServerSession(authOptions);
}

export default async function getCurrentAdmin() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentAdmin = await prisma.admin.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if (!currentAdmin) {
            return null;
        }

        return {
            ...currentAdmin,
            createdAt: currentAdmin.createdAt.toISOString(),
            lastLogin: currentAdmin.lastLogin?.toISOString() || null
        }
    } catch (error: any) {
        return null;
    }
}