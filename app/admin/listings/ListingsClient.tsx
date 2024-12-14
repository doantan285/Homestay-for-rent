'use client';

import Heading from "@/app/components/Heading";
import ListingsTable from "./ListingsTable";
import { SafeAdmin } from "@/app/types";

interface ListingsClientProps {
    currentAdmin: SafeAdmin | null;
}

const ListingsClient: React.FC<ListingsClientProps> = ({currentAdmin}) => {
    return ( 
        <div>
            <Heading
                title="Homestay list management"
                subtitle="Manage the homestay list in the website"
            />
            <ListingsTable currentAdmin={currentAdmin} />
        </div>
     );
}
 
export default ListingsClient;