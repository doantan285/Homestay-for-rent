import { Nunito } from "next/font/google";
import type { Metadata } from 'next';
import './globals.css';

import RootLayoutClient from "./RootLayoutClient";
import getCurrentUser from "./actions/getCurrentUser";

export const metadata: Metadata = {
  title: 'Homestay',
  description: 'Rental And Leasing Homestay',
}

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <RootLayoutClient currentUser={currentUser}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
