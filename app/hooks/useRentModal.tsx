import { create } from 'zustand';

interface RentModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    listing?: any; // Đối tượng listing
    setListing: (listing: any) => void; // Hàm để thiết lập listing
    mode: 'create' | 'update'; // Chế độ tạo mới hoặc cập nhật
    setMode: (mode: 'create' | 'update') => void; // Hàm để thiết lập chế độ
}

const useRentModal = create<RentModalStore>((set) => ({
    isOpen: false,
    listing: undefined,
    mode: 'create', // Mặc định là chế độ tạo mới
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    setListing: (listing) => set({ listing }),
    setMode: (mode) => set({ mode }),
}));

export default useRentModal;
