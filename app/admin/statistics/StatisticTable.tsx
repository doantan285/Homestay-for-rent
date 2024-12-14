'use client';

import { Input, Space, Table, TableProps } from "antd";
import { useStatisticsContext } from "./StatisticsContext";

const StatisticTable = () => {
    const { data } = useStatisticsContext();

    const formatPrice = (price?: number): string => {
        if (!price) return "0";
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const columns = [
        { title: "Period Of Time", dataIndex: "date", key: "date" },
        { title: "User Registration", dataIndex: "userRegistration", key: "userRegistration" },
        { title: "Number Of Homestays", dataIndex: "numberOfHomestays", key: "numberOfHomestays" },
        { title: "Number Of Bookings", dataIndex: "numberOfBookings", key: "numberOfBookings" },
        { title: "Revenue", dataIndex: "revenue", key: "revenue", render: (revenue: number) => <strong className="text-green-500">{formatPrice(revenue)} ₫</strong>, },
        { title: "Profit", dataIndex: "profit", key: "profit", render: (profit: number) => <strong className="text-rose-500">{formatPrice(profit)} ₫</strong>, },
        { title: "Payout", dataIndex: "payout", key: "payout", render: (payout: number) => <strong className="text-blue-500">{formatPrice(payout)} ₫</strong>, },
    ];

    return (
        <div className="pt-2 max-h-[400px]">
            <Space
                style={{
                    marginTop: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Input
                    placeholder="Search by date"
                    value={''}
                    onChange={() => { }}
                    style={{ width: 200 }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="date"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
            />
        </div>
    );
};

export default StatisticTable;