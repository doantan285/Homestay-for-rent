'use client';

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

import { Safelisting, SafeUser } from "../types";
import useRentModal from "../hooks/useRentModal";

interface PropertiesClientProps {
    listings: Safelisting[];
    currentUser: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
    listings,
    currentUser
}) => {
    const router = useRouter();
    const rentModal = useRentModal();
    const [deletingId, setDeletingId] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    const onDelete = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/listings/${id}`)
        .then(() => {
            toast.success('Listing deleted');
            router.refresh();
        })
        .catch((error) => {
            toast.error(error?.response?.data?.error);
        })
        .finally(() => {
            setDeletingId('');
        });
    }, [router]);

    const onUpdate = useCallback((id: string) => {
        const listingToUpdate = listings.find(listing => listing.id === id); // Tìm listing theo id
        if (listingToUpdate) {
            rentModal.onOpen(listingToUpdate); // Mở RentModal với dữ liệu của listing
        }
    }, [listings, rentModal]);

    return ( 
        <Container>
            <Heading
                title="Properties"
                subtitle="List of your properties"
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
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        disabled={updatingId === listing.id || deletingId === listing.id}
                        actionLabel="Update"
                        secondActionLabel="Delete"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
     );
}
 
export default PropertiesClient;