import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth/authSlice';
import type { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

const OrganizerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-96">
                <h1 className="mb-4 text-2xl font-bold text-center">Organizer Dashboard</h1>
                <div className="mb-4">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.roles.join(', ')}</p>
                    {user?.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                    <p><strong>Verified:</strong> {user?.verified ? 'Yes' : 'No'}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
