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

        if (!process.env.JWT_SECRET) {
            console.error("Missing JWT_SECRET environment variable");
            return res.status(500).json({ message: "Internal server error" });
        }

        const token = sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET!,
            { expiresIn: '4h' }
        );

        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=14400; SameSite=Strict`);

        return res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error: any) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}