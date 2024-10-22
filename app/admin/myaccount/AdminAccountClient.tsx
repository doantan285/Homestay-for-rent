import { SafeAdmin } from "@/app/types";

interface AdminAccountClientProps {
    currentAdmin: SafeAdmin | null;
}

const AdminAccountClient: React.FC<AdminAccountClientProps> = ({
    currentAdmin
}) => {
    return ( 
        <div>
            Admin account client
        </div>
     );
}
 
export default AdminAccountClient;