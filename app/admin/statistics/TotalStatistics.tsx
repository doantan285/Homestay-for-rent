// app/components/TotalStatistics.tsx
import React, { useMemo } from "react";
import { Space } from "antd";

interface TotalStatisticsProps {
  data: {
    userRegistration: number;
    numberOfBookings: number;
    Revenue: number;
    serviceFee: number;
    hostPayout: number;
  }[];
}

const TotalStatistics: React.FC<TotalStatisticsProps> = ({ data }) => {
  // Tính toán totalStatistics
  const totalStatistics = useMemo(() => [
    {
      label: "User Registration",
      value: data.reduce((sum, item) => sum + item.userRegistration, 0),
    },
    {
      label: "Number of bookings",
      value: data.reduce((sum, item) => sum + item.numberOfBookings, 0),
    },
    {
      label: "Revenue",
      value: data.reduce((sum, item) => sum + item.Revenue, 0),
    },
    {
      label: "Service Fee",
      value: data.reduce((sum, item) => sum + item.serviceFee, 0),
    },
    {
      label: "Host Payout",
      value: data.reduce((sum, item) => sum + item.hostPayout, 0),
    },
  ], [data]); // Chỉ tính lại khi `data` thay đổi

  return (
    <Space
      style={{
        marginTop: 8,
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        gap: "1rem",
      }}
      wrap
    >
      {totalStatistics.map((stat, index) => (
        <div
          key={index}
          className="flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm"
        >
          <p className="font-bold text-rose-500 text-lg">{stat.label}:</p>
          <span className="text-gray-800 text-lg">{stat.value.toLocaleString()} ₫</span>
        </div>
      ))}
    </Space>
  );
};

export default TotalStatistics;
