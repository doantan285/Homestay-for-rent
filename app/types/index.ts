import { Listing, Reservation, User } from "@prisma/client"; // Type User tự động tạo ra bởi Prisma dựa trên User trong schema. Type đại diện cho cấu trúc 1 bản ghi 

export type Safelisting = Omit<
    Listing,
    "createdAt"
> & {
    createdAt: string;
}

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: Safelisting;
};

export type SafeUser = Omit< // Omit để loại bỏ thuộc tính không mong muốn: createdAt, updatedAt, và emailVerified từ type User.
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};