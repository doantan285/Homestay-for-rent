'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Table, Image, Select } from 'antd';
import type { TableProps } from 'antd';
import { Safelisting, SafeUser } from '@/app/types';
import axios from 'axios';
import placeholder from '@/public/images/placeholder.jpg';
import toast from 'react-hot-toast';
import { categories } from '@/app/components/navbar/Categories';

const ListingsTable: React.FC = () => {
    const [listings, setListings] = useState<Safelisting[]>([]);
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [filter, setFilter] = useState<string>('All');

    const formatPrice = (price?: number): string => {
        if (!price) return "0";
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listingsResponse = await axios.get('/api/admin/listings');
                const usersResponse = await axios.get('/api/admin/users-management/get');
                setListings(listingsResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching listings or users:', error);
            }
        };
        fetchData();
    }, []);

    const columns: TableProps<Safelisting>['columns'] = [
        {
            title: 'Image',
            dataIndex: 'imageSrc',
            key: 'imageSrc',
            render: (image: string) => (
                <Image
                    width={40}
                    height={40}
                    src={image || placeholder.src}
                    alt="Homestay"
                    style={{ borderRadius: '8px' }}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Information',
            dataIndex: 'id',
            key: 'information',
            render: (id: string) => {
                const listing = listings.find((listing) => listing.id === id);
                return (
                    <div>
                        <div className='flex justify-between'>Rooms: <strong>{listing?.roomCount}</strong></div>
                        <div className='flex justify-between'>Bathrooms: <strong>{listing?.bathroomCount}</strong></div>
                        <div className='flex justify-between'>Guests: <strong>{listing?.guestCount}</strong></div>
                        <div className='flex justify-between'>Price: <strong>{formatPrice(listing?.price)}₫</strong></div>
                    </div>
                );
            },
        },
        {
            title: 'Location',
            dataIndex: 'locationValue',
            key: 'locationValue',
        },
        {
            title: 'Owner',
            dataIndex: 'userId',
            key: 'owner',
            render: (userId: string) => {
                const user = users.find((user) => user.id === userId);
                return user ? user.email : 'Unknown';
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    const filteredData = listings.filter((listing) => {
        const ownerEmail = users.find((user) => user.id === listing.userId)?.email || '';
        const matchesSearch =
            listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
            ownerEmail.toLowerCase().includes(searchText.toLowerCase());

        const matchesFilter = filter === 'All' || listing.category === filter;

        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/admin/listings/${id}`);
            toast.success('Listing deleted successfully');
            setListings(listings.filter((listing) => listing.id !== id));
        } catch (error) {
            toast.error('Failed to delete listing');
        }
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
                        { label: 'All', value: 'All' },
                        ...categories.map((category) => ({
                            label: category.label,
                            value: category.label,
                        }))
                    ]}
                />
            </Space>
            <Table<Safelisting>
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{
                    pageSize: 3,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
            />
        </div>
    );
};

export default ListingsTable;
