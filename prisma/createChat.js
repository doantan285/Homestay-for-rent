const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createChatMessages() {
    try {
        // Dữ liệu cuộc hội thoại
        const chatMessages = [
            {
                senderId: '6703873e523fe1533570af34', // An
                receiverId: '66da64904b26b1619e2f3564', // Đoàn Tần
                message: "Chào Tần, hôm nay bạn có thời gian không?",
                createdAt: new Date('2024-11-22T10:00:00.000Z'),
            },
            {
                senderId: '66da64904b26b1619e2f3564', // Đoàn Tần
                receiverId: '6703873e523fe1533570af34', // An
                message: "Chào An, hôm nay tôi có thời gian. Bạn cần gì?",
                createdAt: new Date('2024-11-22T10:05:00.000Z'),
            },
            {
                senderId: '6703873e523fe1533570af34', // An
                receiverId: '66da64904b26b1619e2f3564', // Đoàn Tần
                message: "Tôi cần bạn hỗ trợ một vài việc. Có thể gặp trực tiếp không?",
                createdAt: new Date('2024-11-22T10:10:00.000Z'),
            },
            {
                senderId: '66da64904b26b1619e2f3564', // Đoàn Tần
                receiverId: '6703873e523fe1533570af34', // An
                message: "Dĩ nhiên. Bạn muốn gặp ở đâu?",
                createdAt: new Date('2024-11-22T10:15:00.000Z'),
            },
            {
                senderId: '6703873e523fe1533570af34', // An
                receiverId: '66da64904b26b1619e2f3564', // Đoàn Tần
                message: "Chúng ta có thể gặp tại quán cà phê lúc 2 giờ nhé.",
                createdAt: new Date('2024-11-22T10:20:00.000Z'),
            },
        ];
        

        // Thêm từng tin nhắn vào bảng Message
        for (const message of chatMessages) {
            await prisma.message.create({
                data: message,
            });
        }

        console.log('Chat messages created successfully');
    } catch (error) {
        console.error('Error creating chat messages:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createChatMessages();
