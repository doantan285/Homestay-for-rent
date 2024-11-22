import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import ManageBookingClient from "./ManageBookingClient";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";

const ManageBookingPage = async () => {
    const currentUser = await getCurrentUser();
    const reservations = await getReservations({ hostId: currentUser?.id });

    // console.log(reservations);

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        );
    }

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No reservations found"
                    subtitle="Looks like you have no reservations on your properties"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ManageBookingClient
                reservations={reservations}
            />
        </ClientOnly>
    );
};

export default ManageBookingPage;
