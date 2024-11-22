"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import fakeDashboard from "@/app/fake-data/fakeDashboard";

const BarChart = () => {
  // Chuẩn bị dữ liệu từ fakeDashboard
  const chartData = {
    labels: fakeDashboard.map((item) => item.day), // Gán labels là các ngày
    datasets: [
      {
        label: "Revenue",
        data: fakeDashboard.map((item) => item.revenue), // Lấy dữ liệu revenue
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Màu cột
        borderColor: "rgba(75, 192, 192, 1)", // Viền
        borderWidth: 1, // Độ dày viền
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
          label: (context: TooltipItem<'bar'>) => `Revenue: $${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Trục Y bắt đầu từ 0
      },
    },
  };

  // Tổng doanh thu
  const totalRevenue = fakeDashboard.reduce((total, item) => total + item.revenue, 0);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold text-center mb-4">Total Revenue: ${totalRevenue}</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
