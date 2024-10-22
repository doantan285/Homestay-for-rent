import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { sign } from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin || !admin.hashedPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isCorrectPassword = await bcrypt.compare(password, admin.hashedPassword);

        if (!isCorrectPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);

        return res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}