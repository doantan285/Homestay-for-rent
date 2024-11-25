'use client';

import { FloatButton } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ChatModal from '../modals/ChatModal';
import { SafeUser } from '@/app/types';
import ContactList from '../chat/ContactList';

interface FloatChatButtonProps {
    currentUser: SafeUser | null;
    message: any[];
}

const FloatChatButton: React.FC<FloatChatButtonProps> = (
    { currentUser, message }
) => {
    const [isContactListOpen, setIsContactListOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>(message); // State lưu tin nhắn

    const handleToggleContactList = () => setIsContactListOpen((prev) => !prev);

    const handleContactClick = (contact: any, messages: any[]) => {
        setSelectedContact({ contact, messages });
        setIsChatModalOpen(true); // Hiển thị ChatModal
        setIsContactListOpen(false); // Đóng ContactList
    };

    const handleCloseChatModal = () => setIsChatModalOpen(false);

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {isContactListOpen ? (
                <ContactList
                    onClose={handleToggleContactList} // Đóng ContactList
                    currentUser={currentUser}
                    message={message}
                    onContactClick={handleContactClick} // Gọi khi chọn contact
                />
            ) : (
                <FloatButton
                    icon={<MessageOutlined />}
                    type="primary"
                    onClick={handleToggleContactList} // Mở ContactList
                    className='z-[9999]'
                />
            )}
            {isChatModalOpen && selectedContact && (
                <ChatModal
                    currentUser={currentUser}
                    contact={selectedContact.contact}
                    messages={selectedContact.messages}
                    onClose={handleCloseChatModal} // Đóng ChatModal
                    setMessages={setMessages} // Cập nhật tin nhắn
                />
            )}
        </div>
    );
}

export default FloatChatButton;