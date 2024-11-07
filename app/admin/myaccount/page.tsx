'use client';

import AdminAccountClient from "./AdminAccountClient";
import { SafeAdmin } from "@/app/types";

interface MyAccountProps {
    currentAdmin: SafeAdmin | null;
}

const MyAccount: React.FC<MyAccountProps> = ({ currentAdmin }) => {
    return (
        <AdminAccountClient
            currentAdmin={currentAdmin}
        />
    );
}

export default MyAccount;