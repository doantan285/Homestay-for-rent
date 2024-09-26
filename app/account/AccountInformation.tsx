import axios from "axios";

import { useState } from "react";
import toast from "react-hot-toast";

interface AccountInformationProps {
    title: string;
    content: string | null | undefined;
    actionLabel?: string;
    updateField?: string;
    lastPasswordUpdated?: Date | null;
}
11
const AccountInformation: React.FC<AccountInformationProps> = ({
    title,
    content,
    actionLabel,
    updateField,
    lastPasswordUpdated
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordLastUpdated, setPasswordLastUpdated] = useState(lastPasswordUpdated);

    const handleSave = async () => {
        // if (newContent === content) {
        //     toast.error("No changes made.");
        //     setIsEditing(false);
        //     return;
        // }

        setLoading(true);

        try {
            let apiUrl = "";
            let data = {};

            if (updateField === "name") {
                apiUrl = "/api/account/name";
                data = { name: newContent };
            } else if (updateField === "phoneNumber") {
                apiUrl = "/api/account/phone";
                data = { phoneNumber: newContent };
            } else if (updateField === "password") {
                if (!currentPassword || !newPassword || !confirmNewPassword) {
                    toast.error("All password fields are required.");
                    setLoading(false);
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                    toast.error("New password and confirm password do not match.");
                    setLoading(false);
                    return;
                }
                apiUrl = "/api/account/change-password";
                data = {
                    currentPassword,
                    newPassword,
                    confirmNewPassword
                };
            }

            await axios.put(apiUrl, data);
            toast.success(`${title} updated successfully!`);

            if (updateField === "password") {
                setPasswordLastUpdated(new Date());
            }

            setIsEditing(false);
        } catch (error) {
            toast.error(`Failed to update ${title}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setNewContent(content);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsEditing(false);
    };

    return (
        <div
            className="
                py-3
                px-4
                border-b
                border-solid
                border-gray-200
                flex
                justify-between
                items-center
            "
        >
            <div>
                <div className="font-bold text-base">
                    {title}
                </div>
                <div>
                    {isEditing ? (
                        <div className="flex flex-col space-y-2">
                            {updateField === "password" ? (
                                <>
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    />
                                </>
                            ) : (
                                <input
                                    type="text"
                                    value={newContent || ""}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                            )}
                            <div className="flex space-x-2">
                                <button onClick={handleSave} className="bg-red-500 text-white px-3 py-1 rounded">
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 rounded">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        updateField === "password" ? (
                            passwordLastUpdated
                                ? `Last updated ${passwordLastUpdated.toLocaleDateString()}`
                                : "Password not updated yet"
                            
                        ) : (
                            newContent
                        )
                    )}
                </div>
            </div>
            <div className="font-semibold underline cursor-pointer hover:text-red-500 flex">
                {!isEditing && (
                    <span onClick={() => setIsEditing(true)}>{actionLabel}</span>
                )}
            </div>
        </div>
    );
}

export default AccountInformation;