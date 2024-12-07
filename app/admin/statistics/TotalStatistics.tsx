import React, { useMemo, useEffect, useState } from "react";
import { DatePicker, Select, Space } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;
import axios from "axios"; // Dùng axios để gọi API backend

interface TotalStatisticsProps { }

const TotalStatistics: React.FC<TotalStatisticsProps> = () => {
  const [statistics, setStatistics] = useState({
    userRegistration: 0,
    numberOfBookings: 0,
    revenue: 0,
    profit: 0,
    payout: 0,
    numberOfHomestays: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedMonth("all");
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/statistics/", {
          params: { year: selectedYear, month: selectedMonth },
        });

        setStatistics({
          userRegistration: response.data.userRegistration || 0,
          numberOfBookings: response.data.numberOfBookings || 0,
          revenue: response.data.revenue || 0,
          profit: response.data.profit || 0,
          payout: response.data.payout || 0,
          numberOfHomestays: response.data.numberOfHomestays || 0,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedYear, selectedMonth]);

  const totalStatistics = useMemo(() => [
    { label: "User(s)", value: statistics.userRegistration },
    { label: "Homestay(s)", value: statistics.numberOfHomestays },
    { label: "Reservation(s)", value: statistics.numberOfBookings },
    { label: "Revenue", value: statistics.revenue, isCurrency: true },
    { label: "Profit", value: statistics.profit, isCurrency: true },
    { label: "Payout", value: statistics.payout, isCurrency: true },
  ], [statistics]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full mt-2">
      <div className="flex justify-start mb-4">
        <Space style={{ gap: "1rem" }}>
          <p className="text-lg">View statistics by:</p>
          <Select
            placeholder="Select Year"
            style={{ width: 150 }}
            onChange={handleYearChange}
            value={selectedYear}
            className="rounded-md"
          >
            <Option value="all">All</Option>
            <Option value="2024">2024</Option>
            <Option value="2023">2023</Option>
          </Select>
          {selectedYear !== "all" && (
            <Select
              placeholder="Select Month"
              style={{ width: 150 }}
              onChange={handleMonthChange}
              value={selectedMonth}
              className="rounded-md"
            >
              <Option value="all">All</Option>
              {[...Array(12)].map((_, index) => (
                <Option key={`month-${index + 1}`} value={index + 1}>
                  {`Month ${index + 1}`}
                </Option>
              ))}
            </Select>
          )}
        </Space>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {totalStatistics.map((stat, index) => (
          <div
            key={stat.label}
            className="flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-md shadow-md"
          >
            <p className="font-bold text-rose-500 text-lg">{stat.label}:</p>
            <span className="text-gray-800 text-lg">
              {stat.value !== undefined ? stat.value.toLocaleString() : "0"}
              {stat.isCurrency ? " ₫" : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalStatistics;
