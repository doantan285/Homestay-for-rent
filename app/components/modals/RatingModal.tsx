'use client';

import { useEffect, useState } from "react";
import useRatingModal from "@/app/hooks/useRatingModal";
import { SafeReservation, Safelisting } from "@/app/types";
import Modal from "../modals/Modal";
import axios from "axios";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import toast from "react-hot-toast";

interface RatingModalProps {
    listingId?: string;
    listingTitle?: string;
    onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ listingId, listingTitle, onClose }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmitRating = async () => {
        setErrorMessage('');

        if (!rating || !comment) {
            setErrorMessage('Please provide both a rating and a comment.');
            return;
        }

        try {
            const response = await axios.post('/api/review', {
                listingId: listingId,
                rating,
                comment,
            });

            if (response.status === 201) {
                toast.success("Your review has been submitted!");
                onClose();
            }
        } catch (error) {
            setErrorMessage('An error occurred while submitting your review. Please try again.');
            console.error("Error submitting review:", error);
        }
    };

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={starValue}
                    onClick={() => handleStarClick(starValue)}
                    className="cursor-pointer"
                >
                    {starValue <= rating ? (
                        <AiFillStar className="text-yellow-500" size={24} />
                    ) : (
                        <AiOutlineStar className="text-gray-400" size={24} />
                    )}
                </span>
            );
        });
    };

    const bodyContent = (
        <div>
            <div className="my-4">
                <label>Rating (1-5)</label>
                <div className="flex space-x-2 mt-2">{renderStars()}</div>
            </div>
            <div className="my-4">
                <label>Comment</label>
                <textarea
                    className="border p-2 rounded w-full"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            {errorMessage && (
                <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                </div>
            )}
        </div>
    );

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            onSubmit={handleSubmitRating}
            title={`Rate your stay at ${listingTitle}`}
            actionLabel="Submit Rating"
            body={bodyContent}
            secondaryAction={onClose}
            secondaryActionLabel="Close"
        />
    );
};

export default RatingModal;
