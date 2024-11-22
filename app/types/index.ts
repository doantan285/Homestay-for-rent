import { Admin, Listing, Reservation, Review, User } from "@prisma/client"; // Type User tự động tạo ra bởi Prisma dựa trên User trong schema. Type đại diện cho cấu trúc 1 bản ghi 

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
    "createdAt" | "updatedAt" | "emailVerified" | "lastPasswordUpdated"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
    lastPasswordUpdated: string | null;
};

export type SafeUserForReview = Pick<User, "id" | "name" | "image">;

export type SafeAdmin = Omit<
    Admin,
    "createdAt" | "lastLogin" | "updatedAt" | "lastPasswordUpdated"
> & {
    createdAt: string; // Chuyển đổi thành string
    lastLogin: string | null; // Chuyển đổi thành string hoặc null
    lastPasswordUpdated: string | null; // Chuyển đổi thành string hoặc null
    updatedAt: string | null; // Thêm updatedAt nếu bạn muốn sử dụng
}

export type SafeReview = Omit<
    Review,
    "createdAt" | "user"
> & {
    createdAt: string;
    user: SafeUserForReview;
};