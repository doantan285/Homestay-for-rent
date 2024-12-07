import { Input, Space, Table, TableProps, Select, Button } from "antd";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(false);

    const formatPrice = (price?: number): string => {
        if (!price) return "0";
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSave = async (transactionId: string) => {
        const status = selectedStatus[transactionId];
        try {
            await axios.patch(`/api/admin/transactions/${transactionId}`, { status });
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
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update transaction status.");
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
            title: 'Transaction ID',
            dataIndex: 'paypalTransactionId',
            key: 'paypalTransactionId',
        },
        {
            title: 'Reservation ID',
            dataIndex: 'reservationId',
            key: 'reservationId',
        },
        {
            title: 'Transaction Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => 
                new Intl.DateTimeFormat('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }).format(new Date(createdAt)),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => <strong className="text-green-500">{formatPrice(amount)} ₫</strong>,
        },
        {
            title: 'Service Fee',
            key: 'serviceFee',
            render: (record: any) => (
                <Space>
                    <span>
                        Service Fee ({record.serviceFeeRate}%): <strong className="text-rose-500">{formatPrice(record.serviceFee)} ₫</strong>
                    </span>
                </Space>
            ),
        },
        {
            title: 'Host Payout',
            dataIndex: 'payOut',
            key: 'payOut',
            render: (payOut: number) => <strong className="text-blue-500">{formatPrice(payOut)} ₫</strong>
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
        transaction.paypalTransactionId?.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.reservationId?.toLowerCase().includes(searchText.toLowerCase())
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