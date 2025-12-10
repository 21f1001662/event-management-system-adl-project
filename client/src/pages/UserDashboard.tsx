import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, LogOut, Ticket } from 'lucide-react';
import UserEvents from '@/components/dashboard/user/UserEvents';
import UserBookings from '@/components/dashboard/user/UserBookings';
import ProfileUpdate from '@/components/profile/ProfileUpdate';
import './OrganizerDashboard.css'; // Reusing Organizer styles for now

const UserDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'events' | 'bookings' | 'profile'>('events');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
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
                        onClick={() => { setActiveTab('events'); setSidebarOpen(false); }}
                    >
                        <Calendar size={20} />
                        Events
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('bookings'); setSidebarOpen(false); }}
                    >
                        <Ticket size={20} />
                        Bookings
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                    >
                        <User size={20} />
                        Profile
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LogOut size={18} />
                            Logout
                        </div>
                    </button>
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
        </div>
    );
};

export default UserDashboard;
