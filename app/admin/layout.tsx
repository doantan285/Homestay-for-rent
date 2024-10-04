'use client';

import { useState } from 'react';
import { Admin } from "@prisma/client";
import AdminNavbar from '../components/navbar/AdminNavbar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [selectedSection, setSelectedSection] = useState('Dashboard');

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AdminHeader at the top */}
      <AdminHeader />

      <div className="flex flex-1 pt-16">
        {/* AdminNavbar on the left */}
        <AdminNavbar onSectionChange={handleSectionChange} />

        {/* Main content on the right */}
        <div className="flex-1 p-6 bg-gray-100">
          {selectedSection === 'Dashboard' && <div>Dashboard Content</div>}
          {selectedSection === 'Users' && <div>Users Content</div>}
          {selectedSection === 'Listings' && <div>Listings Content</div>}
          {selectedSection === 'Transactions' && <div>Transactions Content</div>}
          {selectedSection === 'Reviews' && <div>Reviews Content</div>}
          {selectedSection === 'Statistics' && <div>Statistics Content</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;