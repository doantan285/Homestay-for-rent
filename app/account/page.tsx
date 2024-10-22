import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import AccountClient from "./AccountClient";

import getCurrentUser from "../actions/getCurrentUser";

const Account = async () => {
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

    return ( 
        <ClientOnly>
            <AccountClient
                currentUser={currentUser}
            />
        </ClientOnly>
     );
}
 
export default Account;