import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth/authSlice';
import type { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useGetAllEvents } from '@/hooks/api/event';
import './OrganizerDashboard.css';
import { Menu, X, Calendar, User, LogOut, Image as ImageIcon } from 'lucide-react';

const OrganizerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'events' | 'profile'>('events');

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
                            <button className="create-btn" onClick={() => navigate('/organizer/create-event')}>Create Event</button>
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
                ) : (
                    <div className="content-header">
                        <h1 className="page-title">Profile</h1>
                        <div style={{ marginTop: '20px', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div className="mb-4">
                                <p className="mb-2"><strong>Name:</strong> {user?.name}</p>
                                <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
                                <p className="mb-2"><strong>Role:</strong> {user?.roles.join(', ')}</p>
                                {user?.roles.includes('organizer') && (
                                    <p className="mb-2">
                                        <strong>Status:</strong>
                                        <span style={{
                                            marginLeft: '8px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: user.verified ? '#c6f6d5' : '#fed7d7',
                                            color: user.verified ? '#22543d' : '#822727',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.verified ? 'Verified' : 'Unverified'}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrganizerDashboard;
