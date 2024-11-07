'use client';

import { usePathname } from "next/navigation";
import Dashboard from "../admin/dashboard/page";
import Listings from "../admin/listings/page";
import MyAccount from "../admin/myaccount/page";
import Reviews from "../admin/reviews/page";
import Statistics from "../admin/statistics/page";
import Transactions from "../admin/transactions/page";
import Users from "../admin/users/page";
import { SafeAdmin } from "../types";

interface AdminContentProps {
    currentAdmin: SafeAdmin | null;
}

const AdminContent: React.FC<AdminContentProps> = ({ currentAdmin }) => {
    const pathname = usePathname();

    const renderContent = () => {
        switch (pathname) {
            case '/admin/dashboard':
                return <Dashboard />;
            case '/admin/users':
                return <Users />;
            case '/admin/listings':
                return <Listings />;
            case '/admin/transactions':
                return <Transactions />;
            case '/admin/reviews':
                return <Reviews />;
            case '/admin/statistics':
                return <Statistics />;
            case '/admin/myaccount':
                return <MyAccount currentAdmin={currentAdmin} />;
            default:
                return <Dashboard />;
        }
    };
    return (
        <div className="flex-1 p-6 bg-gray-100">
            {renderContent()}
        </div>
    );
}

export default AdminContent;