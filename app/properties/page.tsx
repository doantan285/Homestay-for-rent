import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import PropertiesCLient from "./PropertiesClient";

import getCurrentUser from "../actions/getCurrentUser";
import getListing from "../actions/getListings";

const PropertiesPage = async () => {
    const currentUser = await getCurrentUser();

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

    const listings = await getListing({
        userId: currentUser.id,
    });

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No properties found"
                    subtitle="Look like you hove no properties"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <PropertiesCLient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default PropertiesPage;
