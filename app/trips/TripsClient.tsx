'use client';

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

import { SafeReservation, SafeUser } from "../types";
import RatingModal from "../components/modals/RatingModal";
import useRatingModal from "../hooks/useRatingModal";

interface TripsClientProps {
    reservations: SafeReservation[];
    currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
    reservations,
    currentUser
}) => {
    const { isOpen, reservationId, onOpen, onClose } = useRatingModal();

    const selectedReservation = useMemo(() => {
        return reservations.find((reservation) => reservation.id === reservationId);
    }, [reservationId, reservations]);

    const listingTitle = selectedReservation?.listing?.title;
    const listingId = selectedReservation?.listing?.id;

    const today = new Date();
    const historyReservations = reservations.filter(reservation =>
        new Date(reservation.endDate) < today
    );

    const onRate = useCallback((listing: any) => {
        onOpen(listing);
    }, [onOpen]);

    return (
        <Container>
            <Heading
                title="Trips"
                subtitle="Where you've been and where you're going"
            />
            <div
                className="
                    mt-10
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                "
            >
                {historyReservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onRating={onRate}
                        disabled={false}
                        actionLabel="Rating"
                        currentUser={currentUser}
                    />
                ))}
            </div>
            {isOpen && reservationId && (
                <RatingModal
                    listingId={listingId}
                    listingTitle={listingTitle}
                    onClose={onClose}
                />
            )}
        </Container>
    );
}

export default TripsClient;