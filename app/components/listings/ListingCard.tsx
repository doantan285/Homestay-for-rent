'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { Safelisting, SafeReservation, SafeUser } from "@/app/types";
import useRentModal from "@/app/hooks/useRentModal";
import { format } from "date-fns";
import HeartButton from "../HeartButton";
import Button from "../Button";
import RentModal from "../modals/RentModal";

interface ListingCardProps {
    data: Safelisting;
    reservation?: SafeReservation;
    onDelete?: (id: string) => void;
    onUpdate?: (id: string) => void;
    onRating?: (id: string) => void;
    onAccept?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    secondActionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onDelete,
    onUpdate,
    onRating,
    onAccept,
    disabled,
    actionLabel,
    secondActionLabel,
    actionId = "",
    currentUser,
}) => {
    const router = useRouter();
    const rentModal = useRentModal();

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const handleDelete = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onDelete?.(actionId);
        }, [onDelete, actionId, disabled]);

    const handleShowRentModal = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();

        rentModal.setMode('update');
        rentModal.setListing(data);
        rentModal.onOpen();
    };

    const handleRating = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (onRating) {
            onRating(actionId);
        }
    };

    const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (onAccept) {
            onAccept(actionId);
        }
    };

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`;
    }, [reservation]);

    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="
                col-span-1 cursor-pointer group
            "
        >
            <div className="flex flex-col gap-2 w-full">
                <div
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image
                        fill
                        alt="Listing"
                        src={data.imageSrc[0]}
                        className="
                            object-cover
                            h-full
                            w-full
                            group-hover:scale-110
                            transition
                        "
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">{data?.title}</div>
                <div className="font-semibold text-xs">
                    {data?.province}, {data?.district}, {data?.ward}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        {formatPrice(price)} ₫
                    </div>
                    {!reservation && (
                        <div className="font-light">/ night</div>
                    )}
                </div>
                <div className="flex flex-row gap-2">
                    {onUpdate && (
                        <Button
                            disabled={disabled}
                            small
                            label={actionLabel || 'Update'}
                            onClick={handleShowRentModal}
                        />
                    )}
                    {onAccept && (
                        <Button
                            disabled={disabled}
                            small
                            label={actionLabel || 'Accept'}
                            onClick={handleAccept}
                        />
                    )}
                    {onDelete && secondActionLabel && (
                        <Button
                            outline
                            disabled={disabled}
                            small
                            label={secondActionLabel}
                            onClick={handleDelete}
                        />
                    )}
                    {onRating && (
                        <Button
                            disabled={disabled}
                            small
                            label={actionLabel || 'Rating'}
                            onClick={handleRating}
                        />
                    )}
                </div>
                <div className="text-sm text-neutral-500">
                    {reservation?.status === "PENDING" && "Pending approval"}
                    {reservation?.status === "ACCEPTED" && "Reservation accepted"}
                    {reservation?.status === "DECLINED" && "Reservation declined"}
                </div>
            </div>
        </div>
    );
}

export default ListingCard;