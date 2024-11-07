'use client';

import { useState } from "react";
import AdminNavbar from "../components/navbar/AdminNavbar";

const AdminLayoutClient = () => {
    const [selectedSection, setSelectedSection] = useState('Dashboard');

    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
    };

    return (
        <AdminNavbar onSectionChange={handleSectionChange} />
    );
};

export default AdminLayoutClient;