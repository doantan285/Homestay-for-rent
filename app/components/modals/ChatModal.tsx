'use client';

import { Card, Input, Button, Avatar } from 'antd';
import { useState } from 'react';
import { SafeUser } from '@/app/types';
import { CloseOutlined } from '@ant-design/icons';

interface ChatModalProps {
    onClose: () => void;
    currentUser: SafeUser | null;
    contact: {
        name: string;
        image: string;
        id: string;
    } | null;
    messages: any[];
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, currentUser, contact, messages }) => {
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = () => {

    };

    return (
        <Card
            title={contact ? (
                <div className="flex items-center gap-2">
                    <Avatar src={contact.image} size={50} className="w-12 h-12" />
                    <strong>{contact.name}</strong>
                </div>
            ) : 'Chat'}
            extra={<Button type="text" onClick={onClose}><CloseOutlined /></Button>}
            style={{
                width: 450,
                height: 500,
                position: 'fixed',
                bottom: 24,
                right: 24,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
        >
            <div className="flex h-full">
                <div className="w-2/3 flex flex-col pl-6 h-[450px]">
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded">
                        {messages.length > 0 ? (
                            <div className="flex-grow overflow-auto">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`mb-2 ${msg.sender.id === contact?.id ? 'text-left' : 'text-right'}`}>
                                        <p className="p-2 rounded bg-gray-100 inline-block">{msg.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-gray-500">
                                No messages yet.
                            </div>
                        )}
                    </div>

                    {/* Ô nhập tin nhắn */}
                        {/* <div className="flex gap-2 mt-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message"
                                className="flex-grow"
                            />
                            <Button type="primary" onClick={handleSend} loading={loading}>
                                Send
                            </Button>
                        </div> */}
                </div>
            </div>
        </Card>
    );
};

export default ChatModal;
