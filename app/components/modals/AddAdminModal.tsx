import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormInstance } from 'antd/es/form';

interface AddAdminModalProps {
    visible: boolean;
    onOk: () => Promise<void>;
    onCancel: () => void;
    form: FormInstance;
}

const { Option } = Select;

const AddAdminModal: React.FC<AddAdminModalProps> = ({ visible, onOk, onCancel, form }) => (
    <Modal
        title="Add New Admin"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
    >
        <Form form={form} layout="vertical">
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Please input the email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input the password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select the role!' }]}
            >
                <Select placeholder="Select a role">
                    <Option value="ADMIN">ADMIN</Option>
                    <Option value="SUPERADMIN">SUPERADMIN</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                    { required: true, message: 'Please input the phone number!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Please enter a valid phone number!' },
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    </Modal>
);

export default AddAdminModal;
