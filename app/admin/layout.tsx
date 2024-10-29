'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminNavbar from '../components/navbar/AdminNavbar';
import AdminHeader from '../components/AdminHeader';
import AdminLogin from './login/page';
import AdminContent from '../components/AdminContent';
import getCurrentAdmin from '../actions/getCurrentAdmin';
import axios from 'axios';
import { Admin } from '@prisma/client';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? '';
  const isLoginPage = pathname === '/admin/login';

  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [selectedSection, setSelectedSection] = useState('Dashboard');

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

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <>
      {isLoginPage ? (
        <AdminLogin />
      ) : (
        <div className="min-h-screen flex flex-col">
          <AdminHeader currentAdmin={currentAdmin} />
          <div className="flex flex-1 pt-16">
            <AdminNavbar onSectionChange={handleSectionChange} />
            <AdminContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;