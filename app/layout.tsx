import { Nunito } from "next/font/google";
import type { Metadata } from 'next';
import './globals.css';

import RootLayoutClient from "./RootLayoutClient";
import getCurrentUser from "./actions/getCurrentUser";
import getMessages from "./actions/getMessage";

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
  const message = await getMessages();

  return (
    <html lang="en">
      <body className={font.className}>
        <RootLayoutClient currentUser={currentUser} message={message}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
