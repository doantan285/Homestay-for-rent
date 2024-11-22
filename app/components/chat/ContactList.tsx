'use client';

import { List, Avatar, Input, Card, Button } from 'antd';
import { SafeUser } from '@/app/types';
import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ChatModal from '../modals/ChatModal';

interface ContactListProps {
    onClose: () => void;
    currentUser: SafeUser | null;
    message: any[];
}

const ContactList: React.FC<ContactListProps> = ({ onClose, currentUser, message }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<any | null>(null);

    const filteredMessages = message.filter((msg) =>
        msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.receiver.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const latestMessagesMap = new Map<string, any>();

    filteredMessages.forEach((msg) => {
        const contact = msg.sender.id === currentUser?.id ? msg.receiver : msg.sender;

        if (!latestMessagesMap.has(contact.id)) {
            latestMessagesMap.set(contact.id, msg);
        } else {
            const existingMsg = latestMessagesMap.get(contact.id);
            if (new Date(msg.createdAt) > new Date(existingMsg.createdAt)) {
                latestMessagesMap.set(contact.id, msg);
            }
        }
    });

    const uniqueContacts = Array.from(latestMessagesMap.values());

    const getContactInfo = (message: any) => {
        const contact = message.sender.id === currentUser?.id ? message.receiver : message.sender;
        return {
            name: contact.name,
            image: contact.image,
            id: contact.id,
        };
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return {
            date: `${day}/${month}/${year}`,
            time: `${hours}:${minutes}`,
        };
    };

    const handleContactClick = (msg: any) => {
        const contact = getContactInfo(msg);
        const contactMessages = message.filter(
            (m) =>
                (m.sender.id === contact.id && m.receiver.id === currentUser?.id) ||
                (m.receiver.id === contact.id && m.sender.id === currentUser?.id)
        );

        setSelectedContact({ contact, messages: contactMessages });
    };

    const handleCloseChat = () => setSelectedContact(null);

    if (selectedContact) {
        return (
            <ChatModal
                currentUser={currentUser}
                contact={selectedContact.contact}
                messages={selectedContact.messages}
                onClose={handleCloseChat}
            />
        );
    }

    return (
        <Card
            title={<strong>Contact List</strong>}
            extra={<Button type="text" onClick={onClose}><CloseOutlined /></Button>}
            style={{
                width: 400,
                height: 550,
                position: 'fixed',
                bottom: 24,
                right: 24,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
            }}
        >
            <div className="flex flex-col w-full h-[450px]">
                <div className="w-full mb-4">
                    <Input
                        placeholder="Search by name"
                        allowClear
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="overflow-auto flex-grow">
                    <List
                        dataSource={uniqueContacts}
                        renderItem={(msg) => {
                            const contact = getContactInfo(msg);
                            const { date, time } = formatDate(msg.createdAt);

                            const displayMessage = msg.sender.id === currentUser?.id
                                ? `You: ${msg.message}`
                                : msg.message;

                            return (
                                <List.Item
                                    key={msg.id}
                                    className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                                    onClick={() => handleContactClick(msg)}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <Avatar src={contact.image} size={50} className="w-12 h-12" />
                                        <div className="flex-grow">
                                            <div className="flex justify-between">
                                                <strong>{contact.name}</strong>
                                                <p>{date}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="truncate w-[200px]">{displayMessage}</p>
                                                <p>{time}</p>
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </div>
            </div>
        </Card>
    );
};

export default ContactList;
