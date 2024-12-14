import StatisticClient from "./StatisticClient";
import { StatisticsProvider } from "./StatisticsContext";

const StatisticsPage = async () => {
    return (
        <StatisticsProvider>
            <StatisticClient />
        </StatisticsProvider>
    );
};

export default StatisticsPage;
