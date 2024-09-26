'use client';

import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Heading from "../components/Heading";
import Avatar from "../components/Avatar";
import ImageUpload from "../components/inputs/ImageUpload";

import { SafeUser } from "../types";
import AccountInformation from "./AccountInformation";
import Modal from "../components/modals/Modal";
import useAvatarModal from "../hooks/useAvatarModal";

interface AccountClientProps {
    currentUser: SafeUser | null;
}

const AccountClient: React.FC<AccountClientProps> = ({
    currentUser
}) => {
    const avatarModal = useAvatarModal();
    const router = useRouter();

    const { setValue, watch, handleSubmit } = useForm<FieldValues>({
        defaultValues: {
            imageSrc: currentUser?.image || ''
        },
    });

    const imageSrc = watch('imageSrc');

    const handleEditAvatar = () => {
        avatarModal.onOpen();
    };

    const setCustomValue = (field: string, value: any) => {
        setValue(field, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        });
    };

    const handleSubmitAvatar: SubmitHandler<FieldValues> = async (data) => {
        try {
            await axios.put('/api/account/avatar', {
                image: data.imageSrc
            });
            toast.success('Avatar updated successfully!');
            avatarModal.onClose();
            router.refresh(); // Refresh lại để cập nhật avatar mới
        } catch (error) {
            toast.error('Failed to update avatar.');
        }
    };

    let avatarBodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Add your avatar"
                subtitle="You're so beautiful!"
            />
            <ImageUpload
                value={imageSrc}
                onChange={(value) => setCustomValue('imageSrc', value)}
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Heading
                title="Your Account"
                subtitle="Manage your account settings"
            />
            <div className="mt-8 flex flex-row w-full space-x-8">
                <div className="flex-1 mr-6">
                    <AccountInformation
                        title="Email"
                        content={currentUser?.email}
                    />
                    <AccountInformation
                        title="Password"
                        content="Last updated 2 days ago"
                        actionLabel="Change"
                        updateField="password"
                    />
                    <AccountInformation
                        title="Name"
                        content={currentUser?.name}
                        actionLabel="Edit"
                        updateField="name"
                    />
                    <AccountInformation
                        title="Phone number"
                        content={currentUser?.phoneNumber || "Not provided yet!"}
                        actionLabel="Edit"
                        updateField="phoneNumber"
                    />
                </div>
                <div className=" flex flex-col items-center space-y-4">
                    <Avatar src={currentUser?.image} size={200} />
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

export default AccountClient;