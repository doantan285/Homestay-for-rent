// app/components/listings/ListingRate.tsx
'use client';

import { SafeReview } from "@/app/types";
import Avatar from "../Avatar";
import { useMemo } from "react";
import { format } from "date-fns";
import { AiFillStar } from "react-icons/ai";

interface ListingRateProps {
    reviews: SafeReview[];
}

const ListingRate: React.FC<ListingRateProps> = (
    { reviews }
) => {
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return "0.0";
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    }, [reviews]);

    return (
        <div className="col-span-4 flex flex-col gap-6">
            <div className="text-2xl font-semibold flex items-center gap-2">
                <AiFillStar className="text-yellow-500" />
                <span>{averageRating}</span>
                <span className="text-neutral-500">({reviews.length} reviews)</span>
            </div>
            <hr />
            <div className="flex flex-col gap-4">
                {reviews.length === 0 ? (
                    <div>No reviews available.</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Avatar src={review.user.image} />
                                <div>
                                    <div className="font-semibold">{review.user.name}</div>
                                    <div className="text-sm text-neutral-500">
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, index) => (
                                    <AiFillStar key={index} className="text-yellow-500" />
                                ))}
                            </div>
                            <div className="text-neutral-600">
                                {review.comment}
                            </div>
                            <hr />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListingRate;
