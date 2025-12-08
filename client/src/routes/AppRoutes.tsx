import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import Login from '../pages/Login';
import OrganizerRegister from '../pages/OrganizerRegister';
import AdminDashboard from '@/pages/AdminDashboard';
import OrganizerDashboard from '@/pages/OrganizerDashboard';
import CreateEvent from '@/pages/CreateEvent';
import type { RootState } from '@/store';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
    const { accessToken, user } = useSelector((state: RootState) => state.auth);

    if (!accessToken || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const hasRole = user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            // Redirect to appropriate dashboard based on role or home
            if (user.roles.includes('admin')) return <Navigate to="/admin" replace />;
            if (user.roles.includes('organizer')) return <Navigate to="/organizer" replace />;
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/organizer/register" element={<OrganizerRegister />} />

            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route path="/" element={<Home />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                <Route path="/organizer" element={<OrganizerDashboard />} />
                <Route path="/organizer/create-event" element={<CreateEvent />} />
            </Route>
        </Routes>
    );
}
