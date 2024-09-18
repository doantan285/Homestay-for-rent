import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListing(
    params: IListingsParams
) {
    try {
        const {
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount
            }
        }

        if (guestCount) {
            query.guestCount = {
                gte: +guestCount
            }
        }
        
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount
            }
        }

        if (locationValue) {
            query.locationValue = locationValue; 
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate }, // Đặt chỗ có ngày kết thúc sau hoặc bằng với ngày bắt đầu mà người dùng chọn
                                startDate: { lte: startDate }, // Đặt chỗ có ngày bắt đầu trước hoặc bằng với ngày bắt đầu mà người dùng chọn
                            },
                            {
                                startDate: { lte: endDate }, // Đặt chỗ có ngày bắt đầu trước hoặc bằng với ngày kết thúc mà người dùng chọn
                                endDate: { gte: endDate } // Đặt chỗ có ngày kết thúc sau hoặc bằng với ngày kết thúc mà người dùng chọn
                            }
                        ]
                    }
                }
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}