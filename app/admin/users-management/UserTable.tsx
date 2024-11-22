'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table, Image, Select } from 'antd';
import type { TableProps } from 'antd';
import { SafeUser } from '@/app/types';
import axios from 'axios';
import placeholder from '@/public/images/placeholder.jpg';
import toast from 'react-hot-toast';

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [listingsCount, setListingsCount] = useState<{ [userId: string]: number }>({});
    const [searchText, setSearchText] = useState<string>('');
    const [filter, setFilter] = useState<string>('All');
    const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState<string>('');

    const columns: TableProps<SafeUser>['columns'] = [
        {
            title: 'Avatar',
            dataIndex: 'image',
            key: 'image',
            render: (image: string | null | undefined) => (
                <Image
                    width={40}
                    height={40}
                    src={image || placeholder.src}
                    alt="Avatar"
                    style={{ borderRadius: '50%' }}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Total Homestay',
            dataIndex: 'id',
            key: 'totalHomestay',
            render: (id: string) => listingsCount[id] || 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {editingPasswordUserId === record.id ? (
                        <>
                            <Input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: 150 }}
                            />
                            <Button type="primary" onClick={() => handleSavePassword(record.id)}>
                                Save
                            </Button>
                            <Button onClick={() => handleCancelChangePassword()}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button
                            style={{ backgroundColor: "#FFCC00", borderColor: "#FFCC00", marginRight: 75, padding: "10px 30px", fontSize: "16px" }}
                            type="primary"
                            onClick={() => handleChangePassword(record.id)}
                        >
                            Change Pass
                        </Button>
                    )}
                    <Button
                        danger={!record.isLocked}
                        type={record.isLocked ? "default" : "primary"}
                        onClick={() => handleLock(record.id)}
                    >
                        {record.isLocked ? 'Unlock' : 'Lock'}
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchUsersAndListings = async () => {
            try {
                const usersResponse = await axios.get<SafeUser[]>('/api/admin/users-management/get');
                setUsers(usersResponse.data);

                const listingsResponse = await axios.get<{ [userId: string]: number }>('/api/admin/listings/count-by-user');
                setListingsCount(listingsResponse.data);
            } catch (error) {
                console.error('Error fetching users or listings:', error);
            }
        };

        fetchUsersAndListings();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    const filteredData = users.filter((record) => {
        const hasHomestay = listingsCount[record.id] || 0;
        const matchesFilter =
            filter === 'All' ||
            (filter === 'Has Homestay' && hasHomestay > 0) ||
            (filter === 'No Homestay' && hasHomestay === 0);

        const matchesSearch =
            record.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            record.email?.toLowerCase().includes(searchText.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const handleLock = async (id: string) => {
        try {
            const response = await axios.patch(`/api/admin/users-management/${id}`);
            const updatedUser = response.data;

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, isLocked: updatedUser.isLocked } : user
                )
            );

            toast.success(`User ${updatedUser.isLocked ? 'locked' : 'unlocked'} successfully!`);
        } catch (error) {
            console.error('Error locking/unlocking user:', error);
            toast.error('Failed to update user lock status.');
        }
    };

    const handleChangePassword = (id: string) => {
        setEditingPasswordUserId(id);
        setNewPassword('');
    };

    const handleSavePassword = async (id: string) => {
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }

        try {
            const response = await axios.put(`/api/admin/users-management/${id}/change-password`, {
                newPassword,
            });

            if (response.status === 200) {
                toast.success('Password updated successfully');
                setEditingPasswordUserId(null);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password.');
        }
    };

    const handleCancelChangePassword = () => {
        setEditingPasswordUserId(null);
        setNewPassword('');
    };

    return (
        <div className='pt-2 max-h-[400px]'>
            <Space style={{ marginBottom: 8 }}>
                <Input
                    placeholder="Search by name or email"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200 }}
                />
                <Select
                    value={filter}
                    onChange={handleFilterChange}
                    style={{ width: 160 }}
                    options={[
                        { value: 'All', label: 'All' },
                        { value: 'Has Homestay', label: 'Has Homestay' },
                        { value: 'No Homestay', label: 'No Homestay' },
                    ]}
                />
            </Space>
            <Table<SafeUser>
                columns={columns}
                dataSource={filteredData}
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

export default UserTable;
