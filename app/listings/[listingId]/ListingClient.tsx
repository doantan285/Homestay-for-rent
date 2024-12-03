'use client';

import { Range } from "react-date-range";
import { toast } from "react-hot-toast";
import axios from "axios";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Safelisting, SafeReservation, SafeReview, SafeUser } from "@/app/types";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import ListingReservation from "@/app/components/listings/ListingReservation";
import ListingRate from "@/app/components/listings/ListingRate";
import ChatModal from "@/app/components/modals/ChatModal";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: Safelisting & {
        user: SafeUser
    };
    currentUser: SafeUser | null;
    reviews: SafeReview[];
    messages: any[] | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser,
    reviews = [],
    messages = []
}) => {
    const loginModal = useLoginModal();
    const router = useRouter();
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [contact, setContact] = useState<{ id: string; name: string; image: string } | null>(null);
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);

    const handleOpenChat = () => {
        if (!currentUser) {
            toast.error("Please log in to chat.");
            return;
        }

        const host = {
            id: listing.user.id,
            name: listing.user.name || "Unknown User",
            image: listing.user.image || "",
        };

        const relatedMessages = (messages || [])
            .filter(
                (msg) =>
                    msg.sender &&
                    msg.sender.id &&
                    msg.receiverId &&
                    ((msg.sender.id === currentUser.id && msg.receiverId === host.id) ||
                        (msg.sender.id === host.id && msg.receiverId === currentUser.id))
            )
            .map((msg) => ({
                ...msg,
                sender: {
                    ...msg.sender,
                    id: msg.sender.id || "unknown", // Gán giá trị mặc định nếu thiếu
                },
            }));

        setContact(host);
        setFilteredMessages(relatedMessages);
        setIsChatModalOpen(true);
    };

    const handleCloseChatModal = () => setIsChatModalOpen(false);

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            });

            dates = [...dates, ...range];
        });

        return dates;
    }, [reservations]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }

        setIsLoading(true);

        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
            .then(() => {
                toast.success('Listing reserved!');
                setDateRange(initialDateRange);
                router.push('/reservations');
            })
            .catch(() => {
                toast.error('Something went wrong!');
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            );

            const finalPrice = listing.replacementPrice && listing.replacementPrice > 0 
                ? listing.replacementPrice 
                : listing.price;

            if (dayCount && finalPrice) {
                setTotalPrice(dayCount * finalPrice);
            } else {
                setTotalPrice(finalPrice);
            }
        }
    }, [dateRange, listing.price, listing.replacementPrice]);

    const category = useMemo(() => {
        return categories.find((item) =>
            item.label === listing.category);
    }, [listing.category]);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        listing={listing}
                        currentUser={currentUser}
                    />
                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                    ">
                        <ListingInfo
                            user={listing.user}
                            onOpenChat={handleOpenChat}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                        />
                        <div
                            className="
                                order-first
                                mb-10
                                md:order-last
                                md:col-span-3
                            "
                        >
                            <ListingReservation
                                price={listing.price}
                                replacementPrice={listing.replacementPrice}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                    <ListingRate
                        reviews={reviews}
                    />
                </div>
                {isChatModalOpen && contact && (
                    <ChatModal
                        currentUser={currentUser}
                        contact={contact} // Chủ nhà
                        messages={filteredMessages}
                        setMessages={setFilteredMessages}
                        onClose={handleCloseChatModal}
                    />
                )}
            </div>
        </Container>
    );
}

export default ListingClient;