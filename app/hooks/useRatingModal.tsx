import { create } from 'zustand';

interface RatingModalStore {
    isOpen: boolean;
    reservationId: string | null;
    onOpen: (reservationId: string) => void;
    onClose: () => void;
}

const useRatingModal = create<RatingModalStore>((set) => ({
    isOpen: false,
    reservationId: null,
    onOpen: (reservationId: string) => set({ isOpen: true, reservationId }),  // Mở modal và lưu ID đặt chỗ
    onClose: () => set({ isOpen: false, reservationId: null }),  // Đóng modal và reset reservationId
}));

export default useRatingModal;
