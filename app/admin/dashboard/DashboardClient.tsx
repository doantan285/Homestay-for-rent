import BarChart from "@/app/components/charts/BarChart";
import LineChart from "@/app/components/charts/LineChart";
import Heading from "@/app/components/Heading";

const DashboardClient = () => {
    return (
        <div>
            <Heading
                title="Dashboard"
                subtitle="System Overview"
            />
            <div className="flex pt-6">
                <LineChart />
                <BarChart />
            </div>
        </div>
    );
}

export default DashboardClient;