'use client';

import { Card, Input, Button, Avatar } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { SafeUser } from '@/app/types';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ChatModalProps {
    onClose: () => void;
    currentUser: SafeUser | null;
    contact: { id: string; name: string; image: string } | null;
    messages: any[];
    setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, currentUser, contact, messages, setMessages }) => {
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return; // Nếu tin nhắn trống, không gửi

        setLoading(true);

        try {
            // Gửi yêu cầu POST tới API để lưu tin nhắn
            const response = await axios.post('/api/messages', {
                senderId: currentUser?.id,
                receiverId: contact?.id,
                message: newMessage,
            });

            // Nếu gửi thành công, cập nhật danh sách tin nhắn
            setMessages((prevMessages) => [...prevMessages, response.data]);

            // Reset ô nhập tin nhắn
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
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
                right: 80,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 9998,
            }}
        >
            <div className="flex h-[400px]">
                <div className="flex flex-col w-full">
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded">
                        {messages.length > 0 ? (
                            messages
                                .slice() // Tạo bản sao của mảng tin nhắn
                                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sắp xếp theo thời gian (cũ -> mới)
                                .map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`mb-2 flex ${msg.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`p-2 rounded inline-block ${msg.sender?.id === currentUser?.id
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-gray-100 text-black'
                                                }`}
                                            style={{ maxWidth: '70%', wordWrap: 'break-word' }}
                                        >
                                            {msg.message}
                                            <div className="text-[10px] text-slate-500 mt-1">
                                                {formatDate(msg.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-gray-500">
                                No messages yet.
                            </div>
                        )}
                        <div ref={messagesEndRef}></div>
                    </div>
                    {/* Ô nhập tin nhắn */}
                    <div className="flex gap-2 mt-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message"
                            className="flex-grow"
                        />
                        <Button type="primary" onClick={handleSend} loading={loading} style={{ backgroundColor: 'rgb(244, 63, 94)' }}>
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ChatModal;
