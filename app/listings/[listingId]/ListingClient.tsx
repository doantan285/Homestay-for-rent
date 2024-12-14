'use client';

import { Range } from "react-date-range";
import { toast } from "react-hot-toast";
import axios from "axios";
import { eachDayOfInterval, differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    const totalPriceRef = useRef(totalPrice);
    const dateRangeRef = useRef<Range>(initialDateRange);

    useEffect(() => {
        totalPriceRef.current = totalPrice;
    }, [totalPrice]);

    useEffect(() => {
        dateRangeRef.current = dateRange;
    }, [dateRange]);

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

    const handlePaymentSuccess = async (transactionId: string, paymentDetails: any) => {
        try {
            const reservationResponse = await axios.post('/api/reservations/reservation', {
                totalPrice: totalPriceRef.current,
                startDate: dateRangeRef.current.startDate,
                endDate: dateRangeRef.current.endDate,
                listingId: listing?.id,
            });

            const reservationId = reservationResponse.data.id;

            await axios.post('/api/transactions', {
                transactionId,
                amount: totalPriceRef.current,
                serviceFeeRate: 5.0,
                reservationId: reservationId,
                paymentMethod: "PayPal",
                userId: currentUser?.id,
                paymentDetails,
            });

            router.push('/reservations');
            toast.success("Payment and reservation successful!");
        } catch (error) {
            console.error("Error saving transaction:", error);
            toast.error("An error occurred while processing the payment.");
        }
    };

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

    const isOwner = currentUser?.id === listing.user.id;

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
                            iframe={listing.iframe}
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
                                totalPriceRef={totalPriceRef} // Truyền ref
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                onPaymentSuccess={handlePaymentSuccess}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                                isOwner={isOwner}
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