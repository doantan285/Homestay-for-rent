import Dashboard from "../admin/dashboard/page";
import Listings from "../admin/listings/page";
import MyAccount from "../admin/myaccount/page";
import Reviews from "../admin/reviews/page";
import Statistics from "../admin/statistics/page";
import Transactions from "../admin/transactions/page";
import Users from "../admin/users/page";

interface AdminContentProps {
    selectedSection: string;
}

const AdminContent: React.FC<AdminContentProps> = ({
    selectedSection
}) => {
    return (
        <div className="flex-1 p-6 bg-gray-100">
            {selectedSection === 'Dashboard' && <div><Dashboard /></div>}
            {selectedSection === 'Users' && <div><Users /></div>}
            {selectedSection === 'Listings' && <div><Listings /></div>}
            {selectedSection === 'Transactions' && <div><Transactions /></div>}
            {selectedSection === 'Reviews' && <div><Reviews /></div>}
            {selectedSection === 'Statistics' && <div><Statistics /></div>}
            {selectedSection === 'MyAccount' && <div><MyAccount /></div>}
        </div>
    );
}

export default AdminContent;