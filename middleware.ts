export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/account",
        "/trips",
        "/reservations",
        "/properties",
        "/favorites",
    ],
};
