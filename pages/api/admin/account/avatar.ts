import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const currentAdmin = await getCurrentAdmin(req);

        if (!currentAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Cập nhật ảnh avatar trong database cho admin hiện tại
        const updatedAdmin = await prisma.admin.update({
            where: { id: currentAdmin.id },
            data: { image },
        });

        return res.status(200).json(updatedAdmin);
    } catch (error) {
        console.error("Error updating avatar:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
