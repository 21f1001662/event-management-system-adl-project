import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsers, useVerifyOrganizer } from '@/hooks/api/user';
import { useGetAllEvents, useToggleEventApproval } from '@/hooks/api/event';
import './AdminDashboard.css';
import { Menu, X, Users, Calendar, LogOut, User } from 'lucide-react';
import ProfileUpdate from '@/components/profile/ProfileUpdate';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'events' | 'profile'>('users');

    // Users Filter State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Events Filter State
    const [eventsPage, setEventsPage] = useState(1);
    const [eventsSearch, setEventsSearch] = useState('');
    const [debouncedEventsSearch, setDebouncedEventsSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Debounce events search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedEventsSearch(eventsSearch);
            setEventsPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [eventsSearch]);

    // Data Fetching
    const { data: usersData, isLoading } = useGetAllUsers({
        page,
        limit,
        search: debouncedSearch,
        role: roleFilter
    });

    const { mutate: verifyOrganizer } = useVerifyOrganizer();

    const { data: eventsData, isLoading: isEventsLoading } = useGetAllEvents({
        page: eventsPage,
        limit: 10,
        search: debouncedEventsSearch,
    });

    const { mutate: toggleApproval } = useToggleEventApproval();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleVerifyToggle = (userId: string) => {
        verifyOrganizer(userId);
    };

    const handleApprovalToggle = (eventId: string) => {
        toggleApproval(eventId);
    };

    return (
        <div className="admin-container">
            {/* Mobile Toggle */}
            <button
                className="mobile-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    <div
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
                    >
                        <Users size={20} />
                        Users
                    </div>
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
            <main className="admin-content">
                {activeTab === 'users' ? (
                    <>
                        <div className="content-header">
                            <h1 className="page-title">User Management</h1>
                        </div>

                        <div className="controls-section">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="filter-box">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">User</option>
                                    <option value="organizer">Organizer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-container">
                            {isLoading ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                            ) : (
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersData?.data.users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    {user.roles.map(role => (
                                                        <span key={role} className={`role-badge role-${role}`}>
                                                            {role}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td>
                                                    {user.roles.includes('organizer') ? (
                                                        <span className={`status-badge status-${user.verified ? 'verified' : 'unverified'}`}>
                                                            {user.verified ? 'Verified' : 'Unverified'}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    {user.roles.includes('organizer') && (
                                                        <label className="toggle-switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={user.verified}
                                                                onChange={() => handleVerifyToggle(user.id)}
                                                            />
                                                            <span className="slider"></span>
                                                        </label>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {usersData?.data.users.length === 0 && (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center' }}>No users found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {usersData && usersData.data.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {page} of {usersData.data.totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    disabled={page === usersData.data.totalPages}
                                    onClick={() => setPage(p => Math.min(usersData.data.totalPages, p + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : activeTab === 'events' ? (
                    <>
                        <div className="content-header">
                            <h1 className="page-title">Events Management</h1>
                        </div>

                        <div className="controls-section">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search events by title..."
                                    value={eventsSearch}
                                    onChange={(e) => setEventsSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-container">
                            {isEventsLoading ? (
                                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                            ) : (
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Description</th>
                                            <th>Booked / Max</th>
                                            <th>Flagged</th>
                                            <th>Organizer</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventsData?.data.events.map((event) => (
                                            <tr
                                                key={event.id}
                                                onClick={() => navigate(`/admin/events/${event.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{event.title}</td>
                                                <td title={event.short_description}>
                                                    {event.short_description.length > 30
                                                        ? `${event.short_description.substring(0, 30)}...`
                                                        : event.short_description}
                                                </td>
                                                <td>{event.attendees_count} / {event.capacity}</td>
                                                <td>{event.flag_count}</td>
                                                <td>
                                                    <div>{event.organizer?.name}</div>
                                                    <div style={{ fontSize: '0.8em', color: '#666' }}>{event.organizer?.email}</div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${event.approved ? 'verified' : 'unverified'}`}>
                                                        {event.approved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    <label className="toggle-switch">
                                                        <input
                                                            type="checkbox"
                                                            checked={event.approved}
                                                            onChange={() => handleApprovalToggle(event.id)}
                                                        />
                                                        <span className="slider"></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                        {eventsData?.data.events.length === 0 && (
                                            <tr>
                                                <td colSpan={7} style={{ textAlign: 'center' }}>No events found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {eventsData && eventsData.data.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    disabled={eventsPage === 1}
                                    onClick={() => setEventsPage(p => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {eventsData.data.page} of {eventsData.data.totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    disabled={eventsData.data.page === eventsData.data.totalPages}
                                    onClick={() => setEventsPage(p => Math.min(eventsData.data.totalPages, p + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="content-header">
                        <ProfileUpdate />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
