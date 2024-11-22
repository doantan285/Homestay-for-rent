import Heading from "@/app/components/Heading";
import AdminTable from "./AdminTable";

const AdminManagement = () => {
    return ( 
        <div>
            <Heading
                title="Admin accounts management"
                subtitle="Manage admin accounts in the website"
            />
            <AdminTable />
        </div>
     );
}
 
export default AdminManagement;