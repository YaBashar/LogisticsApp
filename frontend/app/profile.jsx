import useAuth from '@/hooks/useAuth';
import CustomerProfile from './customerProfile';
import AdminProfile from './adminProfile';

export default function Profile() {
    const { role } = useAuth();

    return(
        <>
            { role === 'admin' ? (<AdminProfile />) : (<CustomerProfile />)}
        </>
    )
}