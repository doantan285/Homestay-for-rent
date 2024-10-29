'use client';

import { useEffect, useState } from "react";
import AdminAccountClient from "./AdminAccountClient";
import axios from "axios";
import { SafeAdmin } from "@/app/types";

const MyAccount = () => {
    const [currentAdmin, setCurrentAdmin] = useState<SafeAdmin | null>(null);

    useEffect(() => {
        const fetchCurrentAdmin = async () => {
            try {
                const response = await axios.get('/api/admin/getCurrentAdmin');
                setCurrentAdmin(response.data);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        fetchCurrentAdmin();
    }, []);

    return (
        <AdminAccountClient
            currentAdmin={currentAdmin}
        />
    );
}

export default MyAccount;