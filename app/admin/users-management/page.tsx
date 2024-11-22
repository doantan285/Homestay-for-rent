import Heading from "@/app/components/Heading";
import UserTable from "./UserTable";

const UsersManagement = () => {
    return ( 
        <div>
            <Heading
                title="User accounts management"
                subtitle="Manage user accounts in the website"
            />
            <UserTable />
        </div>
     );
}
 
export default UsersManagement;