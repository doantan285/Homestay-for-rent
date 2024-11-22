import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function GET() {
    try {
        // Lấy tất cả các listing từ database và nhóm lại theo userId
        const listings = await prisma.listing.groupBy({
            by: ['userId'],
            _count: {
                userId: true,
            },
        });

        // Tạo một đối tượng để lưu số lượng listing theo từng userId
        const listingCounts = listings.reduce((acc: { [userId: string]: number }, listing) => {
            acc[listing.userId] = listing._count.userId;
            return acc;
        }, {});

        return NextResponse.json(listingCounts);
    } catch (error) {
        console.error('Error fetching listing counts by user:', error);
        return NextResponse.error();
    }
}
