'use client';

import Heading from "@/app/components/Heading";
import TransactionsTable from "./TransactionsTable";

const TransactionsClient = () => {
    return ( 
        <div>
            <Heading
                title="Transactions"
                subtitle="Manage transactions in the system"
            />
            <TransactionsTable />
        </div>
     );
}
 
export default TransactionsClient;