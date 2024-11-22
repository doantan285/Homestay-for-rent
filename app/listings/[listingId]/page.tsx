import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import getReviews from "@/app/actions/getReviews";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

interface IPrams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: IPrams }) => {
    const listing = await getListingById(params);
    const reservations = await getReservations(params);
    const currentUser = await getCurrentUser();
    const reviews = await getReviews(params);

    // console.log("listing", listing);
    // console.log("reservation", reservations);
    // console.log("currentuser",currentUser);
    // console.log("reviews",reviews);

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
                reviews={reviews}
            />
        </ClientOnly>
    );
}

export default ListingPage;