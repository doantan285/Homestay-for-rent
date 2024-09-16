import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
    userId?: string;
}

export default async function getListing(
    params: IListingsParams
) {
    try {
        const { userId } = params;

        let query = {};

        if (userId) {
            query.userId = userId;
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