'use client';

import Heading from "@/app/components/Heading";
import TotalStatistics from "./TotalStatistics";
import StatisticTable from "./StatisticTable";

const StatisticClient = () => {
    return ( 
        <div>
            <Heading
                title="Statistics"
                subtitle="Statistics and reporting for system revenue"
            />
            <div>
                <TotalStatistics />
                <StatisticTable />
            </div>
        </div>
     );
}
 
export default StatisticClient;