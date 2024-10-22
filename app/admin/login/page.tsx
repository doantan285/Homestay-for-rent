'use client';

import axios from "axios";
import { useState } from "react";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AdminLoginModal = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        try {
            const response = await axios.post('/api/admin/login', data);

            if (response.status === 200) {
                toast.success('Logged in');
                router.push('/admin/dashboard');
            } else {
                toast.error('Failed to login');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data.message || 'Invalid credentials');
                } else if (error.request) {
                    toast.error('No response from server. Please check your connection.');
                } else {
                    toast.error('Request setup error.');
                }
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Admin Login"
                subtitle="Log in to your admin account!"
            />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={true}
            title="Admin Login"
            actionLabel="Login"
            onClose={() => { }}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            isAdminLogin={true}
        />
    );
}

export default AdminLoginModal;
