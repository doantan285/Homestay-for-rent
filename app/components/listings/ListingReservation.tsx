'use client';

import { Range } from "react-date-range";
import Calendar from "../inputs/Calendar";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { MutableRefObject } from "react";
import Button from "../Button";

interface ListingReservationProps {
    price: number;
    replacementPrice?: number | null;
    dateRange: Range;
    totalPrice: number;
    totalPriceRef: MutableRefObject<number>;
    onChangeDate: (value: Range) => void;
    onSubmit: () => void;
    onPaymentSuccess: (transactionId: string, details: any) => void;
    disabled?: boolean;
    disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
    price,
    replacementPrice,
    dateRange,
    totalPrice,
    totalPriceRef,
    onChangeDate,
    onSubmit,
    onPaymentSuccess,
    disabled,
    disabledDates,
}) => {
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const finalPrice = replacementPrice != null && replacementPrice > 0
        ? replacementPrice
        : price;

    return (
        <div
            className="
                bg-white
                rounded-xl
                border-[1px]
                border-neutral-200
                overflow-hidden
            "
        >
            <div className="
                flex flex-row items-center gap-1 p-4
            ">
                <div className="text-2xl font-semibold">
                    {formatPrice(finalPrice)} ₫
                </div>
                <div className="font-light text-neutral-600">
                    / night
                </div>
            </div>
            <hr />
            <Calendar
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => onChangeDate(value.selection)}
            />
            <hr />
            <div className="p-4">
                <PayPalScriptProvider
                    options={{
                        "clientId": process.env.PAYPAL_CLIENT_ID || "",
                        currency: "USD",
                    }}
                >
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "USD",
                                            value: (totalPriceRef.current / 25000).toFixed(2),
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={async (data, actions) => {
                            if (actions?.order) {
                                const details = await actions.order.capture();
                                const transactionId = details.id as string;
                                await onPaymentSuccess(transactionId, details);
                            } else {
                                console.error("actions.order is undefined");
                                toast.error("Payment failed.");
                            }
                        }}
                        onError={(error) => {
                            console.error("Payment failed:", error);
                            toast.error("Payment failed. Please try again.");
                        }}
                    />
                </PayPalScriptProvider>
                <Button
                    disabled={disabled}
                    label="Reserve"
                    onClick={onSubmit}
                />
            </div>
            <div
                className="
                    p-4
                    flex
                    flex-row
                    items-center
                    justify-between
                    font-semibold
                    text-lg
                "
            >
                <div>
                    Total
                </div>
                <div>
                    {formatPrice(totalPrice)} ₫
                </div>
            </div>
        </div>
    );
}

export default ListingReservation;