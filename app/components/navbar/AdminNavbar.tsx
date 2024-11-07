'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Button from '@/app/components/Button';

interface AdminNavbarProps {
  onSectionChange: (section: string) => void;
}

const AdminNavbar = ({ onSectionChange }: AdminNavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState('');

  const sections = useMemo(() => [
    { label: 'Dashboard', value: 'Dashboard', url: '/admin/dashboard' },
    { label: 'Users', value: 'Users', url: '/admin/users' },
    { label: 'Listings', value: 'Listings', url: '/admin/listings' },
    { label: 'Transactions', value: 'Transactions', url: '/admin/transactions' },
    { label: 'Reviews', value: 'Reviews', url: '/admin/reviews' },
    { label: 'Statistics', value: 'Statistics', url: '/admin/statistics' },
    { label: 'My Account', value: 'MyAccount', url: '/admin/myaccount' },
  ], []);

  useEffect(() => {
    const currentSection = sections.find(section => section.url === pathname);
    if (currentSection) {
      setSelectedSection(currentSection.value);
      onSectionChange(currentSection.value);
    }
  }, [pathname, sections, onSectionChange]);

  const handleButtonClick = (section: string, url: string) => {
    setSelectedSection(section);
    onSectionChange(section);
    router.push(url);
  };

  return (
    <div className="w-64 h-full p-6">
      <ul className="space-y-6">
        {sections.map(({ label, value, url }) => (
          <li key={value}>
            <Button
              label={label}
              onClick={() => handleButtonClick(value, url)}
              outline={selectedSection !== value}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNavbar;