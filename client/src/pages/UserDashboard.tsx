import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, LogOut, Ticket } from 'lucide-react';
import UserEvents from '@/components/dashboard/user/UserEvents';
import UserBookings from '@/components/dashboard/user/UserBookings';
import ProfileUpdate from '@/components/profile/ProfileUpdate';
import './OrganizerDashboard.css'; // Reusing Organizer styles for now

import type { RootState } from '@/store';

import ConfirmationModal from '@/components/common/ConfirmationModal';

const UserDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state: RootState) => state.auth);

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'profile'>('events');
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleTabChange = (tab: 'events' | 'bookings' | 'profile') => {
        if (!accessToken && (tab === 'bookings' || tab === 'profile')) {
            setShowLoginModal(true);
            return;
        }
        setActiveTab(tab);
        setSidebarOpen(false);
    };

    return (
        <div className="organizer-container">
            {/* Mobile Toggle */}
            <button
                className="mobile-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`organizer-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">User Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    <div
                        className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => handleTabChange('events')}
                    >
                        <Calendar size={20} />
                        Events
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => handleTabChange('bookings')}
                    >
                        <Ticket size={20} />
                        Bookings
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => handleTabChange('profile')}
                    >
                        <User size={20} />
                        Profile
                    </div>
                </nav>

                <div className="sidebar-footer">
                    {accessToken ? (
                        <button onClick={handleLogout} className="logout-btn">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <LogOut size={18} />
                                Logout
                            </div>
                        </button>
                    ) : (
                        <button onClick={handleLogin} className="logout-btn" style={{ backgroundColor: '#4c51bf' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <User size={18} />
                                Login
                            </div>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="organizer-content">
                {activeTab === 'events' && <UserEvents />}
                {activeTab === 'bookings' && <UserBookings />}
                {activeTab === 'profile' && (
                    <>
                        <div className="content-header">
                        </div>
                        <ProfileUpdate />
                    </>
                )}
            </main>

            <ConfirmationModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onConfirm={() => navigate('/login')}
                title="Login Required"
                message="You need to be logged in to access this section. Would you like to go to the login page?"
                confirmText="Login"
            />
        </div>
    );
};

export default UserDashboard;
