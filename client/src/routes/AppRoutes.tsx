import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import Login from '../pages/Login';
import OrganizerRegister from '../pages/OrganizerRegister';
import AdminDashboard from '@/pages/AdminDashboard';
import OrganizerDashboard from '@/pages/OrganizerDashboard';
import CreateEvent from '@/pages/CreateEvent';
import EventDetails from '@/pages/EventDetails';
import EditEvent from '@/pages/EditEvent';
import UserDashboard from '@/pages/UserDashboard';
import UserEventDetails from '@/components/dashboard/user/UserEventDetails';
import AdminEventDetails from '@/pages/AdminEventDetails';
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
            if (user.roles.includes('organizer')) return <Navigate to="/organizer/dashboard" replace />;
            if (user.roles.includes('user')) return <Navigate to="/user/dashboard" replace />;
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

            <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/events/:id" element={<UserEventDetails />} />

            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                {/* <Route path="/" element={<Home />} /> */}
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/events/:id" element={<AdminEventDetails />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                <Route path="/organizer/create-event" element={<CreateEvent />} />
                <Route path="/organizer/events/:id" element={<EventDetails />} />
                <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
            </Route>
        </Routes>
    );
}
