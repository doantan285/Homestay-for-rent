'use client';

import { Input, Space, Table, TableProps } from "antd";
import fakeStatistics from "../../fake-data/fakeStatistics";

const StatisticTable = () => {
    const columns: TableProps['columns'] = [
        {
            title: 'Period Of Time',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'User Registration',
            dataIndex: 'userRegistration',
            key: 'userRegistration',
        },
        {
            title: 'Number Of Homestays',
            dataIndex: 'userRegistration',
            key: 'userRegistration',
        },
        {
            title: 'Number Of Bookings',
            dataIndex: 'numberOfBookings',
            key: 'numberOfBookings',
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
        },
        {
            title: 'Service Fee',
            dataIndex: 'serviceFee',
            key: 'serviceFee',
        },
        {
            title: 'Host Payout',
            dataIndex: 'hostPayout',
            key: 'hostPayout',
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
        </div>
    );
};

export default StatisticTable;
