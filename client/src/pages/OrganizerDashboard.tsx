import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth/authSlice';
import type { RootState } from '@/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetAllEvents } from '@/hooks/api/event';
import './OrganizerDashboard.css';
import { Menu, X, Calendar, User, LogOut, Image as ImageIcon, ClipboardCheck } from 'lucide-react';
import MarkAttendance from '@/components/organizer/MarkAttendance';
import ProfileUpdate from '@/components/profile/ProfileUpdate';

import { useGetOwnProfile } from '@/hooks/api/user';

const OrganizerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: profileData } = useGetOwnProfile();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const user = profileData?.data || authUser;
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'events' | 'profile' | 'mark-attendance'>(
        (tabParam === 'mark-attendance' ? 'mark-attendance' : 'events') as 'events' | 'profile' | 'mark-attendance'
    );

    // Events Filter State
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Data Fetching
    const { data: eventsData, isLoading } = useGetAllEvents({
        search: debouncedSearch,
        organizerId: user?.id,
        orderBy: 'created_at', // Default sort by creation date
        order: 'DESC',
        limit: 100 // Fetch enough for now, pagination can be added later if needed for grid
    });

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
                    <h2 className="sidebar-title">Organizer Panel</h2>
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
                        className={`nav-item ${activeTab === 'mark-attendance' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('mark-attendance'); setSidebarOpen(false); }}
                    >
                        <ClipboardCheck size={20} />
                        Mark Attendance
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
                {activeTab === 'events' ? (
                    <>
                        <div className="content-header">
                            <h1 className="page-title">My Events</h1>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <button
                                    className="create-btn"
                                    onClick={() => navigate('/organizer/create-event')}
                                    disabled={!user?.verified}
                                    title={!user?.verified ? "Account Approval Required" : "Create new event"}
                                >
                                    Create Event
                                </button>
                                {!user?.verified && (
                                    <span style={{ fontSize: '0.8rem', color: '#e53e3e', marginTop: '5px' }}>
                                        Account pending approval
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="controls-section">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="filter-box">
                                <select
                                    value={orderBy}
                                    onChange={(e) => setOrderBy(e.target.value)}
                                >
                                    <option value="created_at">Newest First</option>
                                    <option value="date">Event Date</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                        ) : (
                            <div className="events-grid">
                                {eventsData?.data.events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-card"
                                        onClick={() => navigate(`/organizer/events/${event.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="event-thumbnail">
                                            {event.image_url ? (
                                                <img
                                                    src={event.image_url}
                                                    alt={event.title}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="placeholder-image"
                                                style={{ display: event.image_url ? 'none' : 'flex' }}
                                            >
                                                <ImageIcon size={48} />
                                            </div>
                                        </div>
                                        <div className="event-details">
                                            <h3 className="event-title">{event.title}</h3>
                                            <p className="event-desc">{event.short_description}</p>

                                            <div className="event-meta">
                                                <div className="attendees-info">
                                                    <span>{event.attendees_count} Attendees</span>
                                                    <span>{event.capacity} Capacity</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${Math.min((event.attendees_count / event.capacity) * 100, 100)}% ` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {eventsData?.data.events.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                                        No events found. Create your first event!
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : activeTab === 'mark-attendance' ? (
                    <MarkAttendance />
                ) : (
                    <>
                        <div className="content-header" style={{ justifyContent: 'center' }}>

                        </div>
                        <ProfileUpdate />
                    </>
                )}
            </main>
        </div>
    );
};

export default OrganizerDashboard;
