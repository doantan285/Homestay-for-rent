import { NextApiRequest, NextApiResponse } from "next";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const currentAdmin = await getCurrentAdmin(req);

        if (!currentAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        return res.status(200).json(currentAdmin);
    } catch (error) {
        console.error('Error fetching current admin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}