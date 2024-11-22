import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export default async function getReviews(
    params: IParams
) {
    try {
        const { listingId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }

        const reviews = await prisma.review.findMany({
            where: query,
            include: {
                user: true, // Lấy thông tin người dùng đã tạo review
            },
            orderBy: {
                createdAt: "desc", // Sắp xếp review theo thời gian, review mới nhất ở đầu
            },
        });

        const safeReviews = reviews.map((review) => ({
            ...review,
            user: {
                id: review.user.id,
                name: review.user.name,
                image: review.user.image,
            },
            createdAt: review.createdAt.toISOString(),
        }));

        return safeReviews;
    } catch(error: any) {
        console.error("Error fetching reviews:", error);
        return [];
    } 
}