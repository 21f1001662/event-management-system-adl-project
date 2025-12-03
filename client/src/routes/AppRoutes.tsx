import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import Login from '../pages/Login';
import type { RootState } from '@/store';

const ProtectedRoute = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    );
}
