import { useState } from 'react';
import Button from '@/app/components/Button';

interface AdminNavbarProps {
  onSectionChange: (section: string) => void;
}

const AdminNavbar = ({ onSectionChange }: AdminNavbarProps) => {
  const [selectedSection, setSelectedSection] = useState('Dashboard');

  const handleButtonClick = (section: string) => {
    setSelectedSection(section);
    onSectionChange(section);
  };

  return (
    <div className="w-64 h-full p-6">
      <ul className="space-y-6">
        <li>
          <Button
            label="Dashboard"
            onClick={() => handleButtonClick('Dashboard')}
            outline={selectedSection !== 'Dashboard'}
          />
        </li>
        <li>
          <Button
            label="Users"
            onClick={() => handleButtonClick('Users')}
            outline={selectedSection !== 'Users'}
          />
        </li>
        <li>
          <Button
            label="Listings"
            onClick={() => handleButtonClick('Listings')}
            outline={selectedSection !== 'Listings'}
          />
        </li>
        <li>
          <Button
            label="Transactions"
            onClick={() => handleButtonClick('Transactions')}
            outline={selectedSection !== 'Transactions'}
          />
        </li>
        <li>
          <Button
            label="Reviews"
            onClick={() => handleButtonClick('Reviews')}
            outline={selectedSection !== 'Reviews'}
          />
        </li>
        <li>
          <Button
            label="Statistics"
            onClick={() => handleButtonClick('Statistics')}
            outline={selectedSection !== 'Statistics'}
          />
        </li>
      </ul>
    </div>
  );
};

export default AdminNavbar;