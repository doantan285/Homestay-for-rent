import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        // Kiểm tra nếu không có `id`
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Xóa admin theo ID
        const deletedAdmin = await prisma.admin.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Admin deleted successfully', deletedAdmin }, { status: 200 });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
    }
}
