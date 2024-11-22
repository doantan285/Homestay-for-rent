'use client';

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Table, Image } from 'antd';
import type { TableProps } from 'antd';
import { SafeAdmin } from '@/app/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddAdminModal from '@/app/components/modals/AddAdminModal';
import placeholder from '@/public/images/placeholder.jpg';

const AdminTable: React.FC = () => {
    const [admins, setAdmins] = useState<SafeAdmin[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingPasswordAdminId, setEditingPasswordAdminId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState<string>('');

    const columns: TableProps<SafeAdmin>['columns'] = [
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
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {editingPasswordAdminId === record.id ? (
                        <>
                            <Input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: 150 }}
                            />
                            <Button
                                type="primary"
                                onClick={() => handleSavePassword(record.id)}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => handleCancelChangePassword()}
                            >
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
                    <Button danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get<SafeAdmin[]>('/api/admin/admins-management/get');
                setAdmins(response.data);
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        fetchAdmins();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const filteredData = admins.filter((record) =>
        record.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        record.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await axios.post('/api/admin/admins-management/add', values);

            if (response.status === 201) {
                toast.success('Admin added successfully');
                const newAdmin = response.data; // Dữ liệu admin mới từ response
                setAdmins((prev) => [...prev, newAdmin]); // Thêm admin mới vào danh sách hiện tại
                setIsModalVisible(false);
                form.resetFields();
            } else {
                toast.error(response.data.error || 'Failed to add admin');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to add admin');
            }
        }
    };

    const handleChangePassword = (id: string) => {
        setEditingPasswordAdminId(id); // Ghi nhận admin đang được chỉnh sửa
        setNewPassword(''); // Reset mật khẩu mới
    };

    const handleSavePassword = async (id: string) => {
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }

        try {
            const response = await axios.put('/api/admin/admins-management/change-password', {
                adminId: id,
                newPassword,
            });

            if (response.status === 200) {
                toast.success('Password updated successfully');
                setEditingPasswordAdminId(null);
                setNewPassword('');
            } else {
                toast.error(response.data.error || 'Failed to update password');
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to update password');
            }
        }
    };

    const handleCancelChangePassword = () => {
        setEditingPasswordAdminId(null);
        setNewPassword('');
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete('/api/admin/admins-management/delete', {
                data: { id },
            });

            if (response.status === 200) {
                toast.success('Admin deleted successfully');
                setAdmins((prev) => prev.filter((admin) => admin.id !== id)); // Cập nhật danh sách sau khi xóa
            } else {
                toast.error(response.data.error || 'Failed to delete admin');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to delete admin');
            }
        }
    };

    return (
        <div className='pt-2 max-h-[400px]'>
            <Space style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Input
                    placeholder="Search by name or email"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200 }}
                />
                <Button
                    style={{ backgroundColor: "#33CC00", borderColor: "#33CC00", marginRight: 75, padding: "10px 30px", fontSize: "16px" }}
                    type="primary"
                    onClick={handleAdd}
                >
                    Add
                </Button>
            </Space>
            <Table<SafeAdmin>
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                }}
            />
            <AddAdminModal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                form={form}
            />
        </div>
    );
};

export default AdminTable;
