import AdminHeader from '../components/AdminHeader';
import AdminLayoutClient from './AdminLayoutClient';
import AdminContent from '../components/AdminContent';
import getCurrentAdmin from '../actions/getCurrentAdmin';

export default async function AdminLayout() {
  const currentAdmin = await getCurrentAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader currentAdmin={currentAdmin} />
      <div className="flex flex-1 pt-16">
        <AdminLayoutClient />
        <AdminContent currentAdmin={currentAdmin} />
      </div>
    </div>
  );
};
