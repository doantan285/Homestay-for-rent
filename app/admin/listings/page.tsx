import Heading from "@/app/components/Heading";
import ListingsTable from "./ListingsTable";

const Listings = () => {
    return ( 
        <div>
            <Heading
                title="Homestay list management"
                subtitle="Manage the homestay list in the website"
            />
            <ListingsTable />
        </div>
     );
}
 
export default Listings;