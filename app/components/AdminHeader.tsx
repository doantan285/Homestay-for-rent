'use client';

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Container from "./Container";
import Logo from "./navbar/Logo";
import Avatar from "./Avatar";
import { Admin } from "@prisma/client";
import MenuItem from "./navbar/MenuItem";
import axios from "axios";
import toast from "react-hot-toast";

interface AdminHeaderProps {
    currentAdmin?: Admin;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    currentAdmin
}) => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/admin/logout');
            toast.success('Logged out successfully');
            router.push('/admin/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <div className="realtive fixed w-full bg-white z-10 shadow-sm">
            <div
                className="
                py-4
                border-b-[1px]
            "
            >
                <Container>
                    <div
                        className="
                        flex
                        flex-row
                        items-center
                        justify-between
                        gap-3
                        md:gap-0
                    "
                    >
                        <Logo />
                        <div
                            onClick={toggleOpen}
                            className="
                        p-4
                        md:py-1
                        md:px-2
                        border-[1px]
                        border-neutral-200
                        flex
                        flex-row
                        items-center
                        gap-3
                        rounded-full
                        cursor-pointer
                        hover:shadow-md
                        transition
                    "
                        >
                            <AiOutlineMenu />
                            <div className="hidden md:block">
                                <Avatar src={currentAdmin?.image} />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            {isOpen && (
                <div
                    className="
                        absolute
                        rounded-xl
                        shadow-md
                        w-[40vw]
                        md:w-1/12
                        bg-white
                        overflow-hidden
                        right-20
                        top-16
                        text-sm
                    "
                >
                    <div className="flex flex-col cursor-pointer">
                        <>
                            <MenuItem
                                onClick={() => router.push("/admin/account")}
                                label="My account"
                            />
                            <hr />
                            <MenuItem
                                onClick={handleLogout}
                                label="Logout"
                            />
                        </>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHeader;