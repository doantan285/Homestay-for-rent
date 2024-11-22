const fakeContacts = [
    { id: 'host1', name: 'Host 1' },
    { id: 'host2', name: 'Host 2' },
    { id: 'host3', name: 'Host 3' },
];

const fakeMessages = [
    // Host 1 conversation
    { id: 1, senderId: 'currentUserId', receiverId: 'host1', message: 'Hi Host 1! Can I book your room?', createdAt: '2024-11-15T08:30:00Z' },
    { id: 2, senderId: 'host1', receiverId: 'currentUserId', message: 'Sure! Which dates are you planning?', createdAt: '2024-11-15T08:35:00Z' },
    { id: 3, senderId: 'currentUserId', receiverId: 'host1', message: 'From Nov 20 to Nov 25.', createdAt: '2024-11-15T08:40:00Z' },
    // Host 2 conversation
    { id: 4, senderId: 'currentUserId', receiverId: 'host2', message: 'Hi Host 2! Is the listing still available?', createdAt: '2024-11-16T10:00:00Z' },
    { id: 5, senderId: 'host2', receiverId: 'currentUserId', message: 'Yes, it is available!', createdAt: '2024-11-16T10:05:00Z' },
    { id: 6, senderId: 'currentUserId', receiverId: 'host2', message: 'Great, I will book it soon.', createdAt: '2024-11-16T10:10:00Z' },
    // Host 3 conversation
    { id: 7, senderId: 'currentUserId', receiverId: 'host3', message: 'Hi Host 3! Can you confirm my booking?', createdAt: '2024-11-17T12:00:00Z' },
    { id: 8, senderId: 'host3', receiverId: 'currentUserId', message: 'Yes, your booking is confirmed.', createdAt: '2024-11-17T12:05:00Z' },
];

export { fakeContacts, fakeMessages };