import getCurrentAdmin from "@/app/actions/getCurrentAdmin";
import AdminAccountClient from "./AdminAccountClient";
import { useEffect, useState } from "react";

const MyAccount = () => {
    // const [currentAdmin, setCurrentAdmin] = useState<any>(null);

    // useEffect(() => {
    //     const fetchAdmin = async () => {
    //         const currentAdmin = await getCurrentAdmin();
    //         setCurrentAdmin(currentAdmin);
    //     };

    //     fetchAdmin();
    // }, []);

    return ( 
        <div>
            {/* <AdminAccountClient
                currentAdmin={currentAdmin}
            /> */}
            account content
        </div>
     );
}
 
export default MyAccount;