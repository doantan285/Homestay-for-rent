'use client';

import Heading from "@/app/components/Heading";
import StatisticTable from "./StatisticTable";

const StatisticClient = () => {
    return ( 
        <div>
            <Heading
                title="Statistics"
                subtitle="Statistics and reporting for system revenue"
            />
            <div>
                <StatisticTable />

            </div>
        </div>
     );
}
 
export default StatisticClient;