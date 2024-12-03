'use client';

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Heading from "@/app/components/Heading";
import Avatar from "@/app/components/Avatar";
import ImageUpload from "@/app/components/inputs/ImageUpload";

import { SafeAdmin } from "@/app/types";
import Modal from "@/app/components/modals/Modal";
import useAvatarModal from "@/app/hooks/useAvatarModal";
import AdminAccountInformation from "./AdminAccountInformation";
import { useCallback, useMemo } from "react";

interface AdminAccountClientProps {
    currentAdmin: SafeAdmin | null;
}

const AdminAccountClient: React.FC<AdminAccountClientProps> = ({
    currentAdmin
}) => {
    const avatarModal = useAvatarModal();
    const router = useRouter();

    const { setValue, watch, handleSubmit } = useForm<FieldValues>({
        defaultValues: {
            imageSrc: currentAdmin?.image || ''
        },
    });

    const imageSrc = watch('imageSrc');

    const handleEditAvatar = useCallback(() => {
        avatarModal.onOpen();
    }, [avatarModal]);

    const setCustomValue = useCallback((field: string, value: any) => {
        setValue(field, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    }, [setValue]);

    const handleSubmitAvatar: SubmitHandler<FieldValues> = useCallback(async (data) => {
        try {
            await axios.put('/api/admin/account/avatar', { image: data.imageSrc });
            toast.success('Avatar updated successfully!');
            avatarModal.onClose();
            router.refresh();
        } catch (error) {
            toast.error('Failed to update avatar.');
        }
    }, [avatarModal, router]);

    const avatarBodyContent = useMemo(() => (
        <div className="flex flex-col gap-8">
            <Heading title="Add your avatar" subtitle="You're so beautiful!" />
            <ImageUpload value={imageSrc} onChange={(value) => setCustomValue('imageSrc', value)} />
        </div>
    ), [imageSrc, setCustomValue]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <Heading
                title="Your Admin Account"
                subtitle="Manage your admin account settings"
            />
            <div className="mt-8 flex flex-row w-full space-x-8">
                <div className="flex-1 mr-6">
                    <AdminAccountInformation
                        title="Email"
                        content={currentAdmin?.email}
                    />
                    <AdminAccountInformation
                        title="Password"
                        content=""
                        actionLabel="Change"
                        updateField="password"
                        lastPasswordUpdated={
                            currentAdmin?.lastPasswordUpdated
                                ? new Date(currentAdmin.lastPasswordUpdated)
                                : null
                        }
                    />
                    <AdminAccountInformation
                        title="Name"
                        content={currentAdmin?.name}
                        actionLabel="Edit"
                        updateField="name"
                    />
                    <AdminAccountInformation
                        title="Phone number"
                        content={currentAdmin?.phoneNumber || "Not provided yet!"}
                        actionLabel="Edit"
                        updateField="phoneNumber"
                    />
                </div>
                <div className=" flex flex-col items-center space-y-4">
                    <Avatar src={currentAdmin?.image} size={200} />
                    <button
                        onClick={() => handleEditAvatar()}
                        className="underline font-semibold hover:text-red-500"
                    >
                        Edit Avatar
                    </button>
                    {avatarModal.isOpen && (
                        <Modal
                            isOpen={avatarModal.isOpen}
                            onClose={avatarModal.onClose}
                            onSubmit={handleSubmit(handleSubmitAvatar)}
                            actionLabel="Upload"
                            secondaryActionLabel="Cancel"
                            title="Your Avatar"
                            body={avatarBodyContent}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAccountClient;