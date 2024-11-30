import { Input, Space, Table, TableProps, Select, Button } from "antd";
import { useState } from "react";
import toast from 'react-hot-toast';

import fakeTransactionData from "@/app/fake-data/fakeTransactionData";

const serviceFeePercentage = 5;

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState(fakeTransactionData);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});

    const handleSave = (transactionId: string) => {
        const status = selectedStatus[transactionId];
        setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
                transaction.id === transactionId
                    ? { ...transaction, status: status }
                    : transaction
            )
        );

        if (status === "paid") {
            toast.success("The amount will be paid to the Host after 24 hour!");
        } else if (status === "refund") {
            toast.success("The money will be refunded to the customer within 24 hours!");
        } else {
            toast.success("Transaction status updated successfully!");
        }
    };

    const handleStatusChange = (transactionId: string, value: string) => {
        setSelectedStatus((prevStatus) => ({
            ...prevStatus,
            [transactionId]: value,
        }));
    };

    const columns: TableProps<any>['columns'] = [
        {
            title: 'TransactionID',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'ReservationID',
            dataIndex: 'reservationId',
            key: 'reservationId',
        },
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => <strong>{amount.toFixed(2)} ₫</strong>,
        },
        {
            title: `Service Fee (${serviceFeePercentage}%)`,
            key: 'serviceFee',
            render: (_, record) => {
                const serviceFee = (record.amount * serviceFeePercentage) / 100;
                return <strong>{serviceFee.toFixed(2)} ₫</strong>;
            },
        },
        {
            title: 'Host Payout',
            key: 'hostPayout',
            render: (_, record) => {
                const serviceFee = (record.amount * serviceFeePercentage) / 100;
                const hostPayout = record.amount - serviceFee;
                return <strong>{hostPayout.toFixed(2)} ₫</strong>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: any) => (
                <Space size="middle">
                    <Select
                        defaultValue={status}
                        onChange={(value) => handleStatusChange(record.id, value)}
                        style={{ width: 120 }}
                        options={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'refund', label: 'Refund' },
                        ]}
                    />
                    <Button type="primary" onClick={() => handleSave(record.id)}>
                        Save
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.reservationId.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="pt-2 max-h-[400px]">
            <Space style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Input
                    placeholder="Search by Transaction ID or Reservation ID"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200 }}
                />
            </Space>
            <Table
                columns={columns}
                dataSource={filteredTransactions}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
            />
        </div>
    );
}

export default TransactionsTable;