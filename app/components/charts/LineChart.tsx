"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

import fakeDashboard from "@/app/fake-data/fakeDashboard";

const LineChart = () => {
  // Chuẩn bị dữ liệu từ fakeDashboard
  const chartData = {
    labels: fakeDashboard.map((item) => item.day), // Gán labels là các ngày
    datasets: [
      {
        label: "Subscribers",
        data: fakeDashboard.map((item) => item.subscribers), // Lấy dữ liệu subscribers
        borderColor: "#FF00CC",
        backgroundColor: "rgba(255, 0, 204, 0.2)",
        fill: true,
        tension: 0.4, // Bo tròn đường cong
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          // Hiển thị thêm thông tin khi hover
          label: (context: TooltipItem<'line'>) => `Subscribers: ${context.raw}`,
        },
      },
    },
  };

  // Tổng số subscribers
  const totalSubscribers = fakeDashboard.reduce((total, item) => total + item.subscribers, 0);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold text-center mb-4">Total Subscribers: {totalSubscribers}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
