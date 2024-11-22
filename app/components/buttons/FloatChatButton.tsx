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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggle = () => setIsModalOpen((prev) => !prev);

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {isModalOpen ? (
                <ContactList
                    onClose={handleToggle}
                    currentUser={currentUser}
                    message={message}
                />
            ) : (
                <FloatButton
                    icon={<MessageOutlined />}
                    type="primary"
                    onClick={handleToggle}
                />
            )}
        </div>
    );
}

export default FloatChatButton;