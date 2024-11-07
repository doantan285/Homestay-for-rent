'use client';

import { usePathname } from 'next/navigation';
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import SearchModal from "./components/modals/SearchModal";
import RentModal from "./components/modals/SearchModal";
import ToasterProvider from "./providers/ToasterProvider";
import AdminLogin from "@/app/admin/login/page";

const RootLayoutClient = ({ children, currentUser }: { children: React.ReactNode, currentUser: any }) => {
    const pathname = usePathname() ?? '';
    const isAdminRoute = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    return (
        <>
            <ClientOnly>
                <ToasterProvider />
                <SearchModal />
                <RentModal />
                <LoginModal />
                <RegisterModal />
                {!isAdminRoute && <Navbar currentUser={currentUser} />}
            </ClientOnly>
            {isAdminRoute ? (
                <div>
                    {isLoginPage ? (
                        <AdminLogin />
                    ) : (
                        children
                    )}
                </div>
            ) : (
                <div className="pb-20 pt-28">
                    {children}
                </div>
            )}
        </>
    );
};

export default RootLayoutClient;