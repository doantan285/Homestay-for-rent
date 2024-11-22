'use client';

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Heading from "../components/Heading";
import Container from "../components/Container";
import { SafeReservation } from "../types";
import ListingCard from "../components/listings/ListingCard";
import axios from "axios";
import toast from "react-hot-toast";

interface ManageBookingClientProps {
    reservations: SafeReservation[];
}

const ManageBookingClient: React.FC<ManageBookingClientProps> = ({ reservations }) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onAccept = useCallback((id: string) => {
        setDeletingId(id);

        axios.put(`/api/reservations/${id}`, { status: "ACCEPTED" }) // Cập nhật trạng thái thành ACCEPTED
            .then(() => {
                toast.success("Booking accepted");
                router.refresh();
            })
            .catch(() => {
                toast.error("Something went wrong!");
            })
            .finally(() => {
                setDeletingId('');
            });
    }, [router]);

    const onDecline = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
            .then(() => {
                toast.success('Booking declined');
                router.refresh();
            })
            .catch(() => {
                toast.error('Somthing went wrong!');
            })
            .finally(() => {
                setDeletingId('');
            })
    }, [router]);

    return (
        <Container>
            <Heading
                title="ManageBooking"
                subtitle="Properties you have booked for your upcoming trip"
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
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onRating={onAccept}
                        actionLabel="Accept"
                        onDelete={onDecline}
                        secondActionLabel="Decline"
                        disabled={false}
                    />
                ))}
            </div>
        </Container>
    );
}

export default ManageBookingClient;