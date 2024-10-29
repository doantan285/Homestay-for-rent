import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {
            await axios.post('/api/admin/logout');
            toast.success('Logged out successfully');
            router.push('/admin/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return logout;
};

export default useLogout;