'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AdminNavbar from '../components/navbar/AdminNavbar';
import AdminHeader from '../components/AdminHeader';
import AdminLogin from './login/page';
import AdminContent from '../components/AdminContent';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? '';
  const isLoginPage = pathname === '/admin/login';

  const [selectedSection, setSelectedSection] = useState('Dashboard');

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <>
      {isLoginPage ? (
        <AdminLogin />
      ) : (
        <div className="min-h-screen flex flex-col">
          <AdminHeader />
          <div className="flex flex-1 pt-16">
            <AdminNavbar onSectionChange={handleSectionChange} />
            <AdminContent selectedSection={selectedSection} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;