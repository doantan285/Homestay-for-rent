'use client';

import { Input, Space, Table, TableProps } from "antd";
import fakeStatistics from "@/app/fake-data/fakeStatistic";
import TotalStatistics from "./TotalStatistics";

const StatisticTable = () => {
    const columns: TableProps['columns'] = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'User Registration',
            dataIndex: 'userRegistration',
            key: 'userRegistration',
        },
        {
            title: 'Number of bookings',
            dataIndex: 'numberOfBookings',
            key: 'numberOfBookings',
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (value: number) => <strong>{value.toLocaleString()} ₫</strong>,
        },
        {
            title: 'Service Fee',
            dataIndex: 'serviceFee',
            key: 'serviceFee',
            render: (revenue: number) => {
                const serviceFee = revenue * 0.05; // Tính service fee là 5% của revenue
                return <strong>{serviceFee.toLocaleString()} ₫</strong>;
            },
        },
        {
            title: 'Host Payout',
            dataIndex: 'hostPayout',
            key: 'hostPayout',
            render: (revenue: number) => {
                const serviceFee = revenue * 0.05; // Tính service fee
                const hostPayout = revenue - serviceFee; // Tiền trả chủ nhà = revenue - service fee
                return <strong>{hostPayout.toLocaleString()} ₫</strong>;
            },
        },
    ];

    return (
        <div className="pt-2 max-h-[400px]">
            <Space
                style={{
                    marginBottom: 8,
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
                dataSource={fakeStatistics}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
            />
            {/* <TotalStatistics data={fakeData} /> */}
        </div>
    );
};

export default StatisticTable;
