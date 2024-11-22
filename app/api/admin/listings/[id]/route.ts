import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.listing.delete({
            where: {
                id: id,  // `id` sẽ là phần tham số trong URL (ví dụ: /api/listings/abc123)
            },
        });
        return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
    }
}
