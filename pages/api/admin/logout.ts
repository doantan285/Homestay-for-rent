import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    destroyCookie({ res }, 'admin-token', {
        path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
}