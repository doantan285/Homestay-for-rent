import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { name, email, password, role, phoneNumber } = await request.json();

        // Kiểm tra nếu tất cả các trường đều có giá trị
        if (!name || !email || !password || !role || !phoneNumber) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Kiểm tra nếu email đã tồn tại
        const existingAdmin = await prisma.admin.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm admin mới vào database
        const newAdmin = await prisma.admin.create({
            data: {
                name,
                email,
                hashedPassword, // lưu mật khẩu đã mã hóa
                role,
                phoneNumber,
            },
        });

        return NextResponse.json(newAdmin, { status: 201 });
    } catch (error) {
        console.error('Error adding admin:', error);
        return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
    }
}
