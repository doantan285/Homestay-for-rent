import ListingsClient from "./ListingsClient";
import { SafeAdmin } from "@/app/types";

interface ListingsProps {
    currentAdmin: SafeAdmin | null;
}

const Listings: React.FC<ListingsProps> = ({currentAdmin}) => {
    return ( 
        <div>
            <ListingsClient currentAdmin={currentAdmin} />
        </div>
     );
}
 
export default Listings;