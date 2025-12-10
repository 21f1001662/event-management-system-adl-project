import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllEvents } from '@/hooks/api/event';
import { Image as ImageIcon, Filter } from 'lucide-react';
import { EventCategory } from '@/api/event/event.dto';

const UserEvents = () => {
    const navigate = useNavigate();

    // Events Filter State
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [orderBy, setOrderBy] = useState('created_at');
    const [showFilters, setShowFilters] = useState(false);
    const [category, setCategory] = useState<EventCategory | ''>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
        orderBy: orderBy,
        order: 'DESC',
        limit: 100,
        approved: 'true',
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
    });

    return (
        <>
            <div className="content-header">
                <h1 className="page-title">Browse Events</h1>
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

                <div className="filter-box" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        className="filter-toggle-btn"
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: showFilters ? '#e2e8f0' : 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <Filter size={20} color="#4a5568" />
                    </button>

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

            {showFilters && (
                <div className="advanced-filters" style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'end',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '500' }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as EventCategory | '')}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '150px' }}
                        >
                            <option value="">All Categories</option>
                            {Object.values(EventCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '500' }}>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '500' }}>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <button
                        onClick={() => {
                            setCategory('');
                            setStartDate('');
                            setEndDate('');
                            setSearch('');
                        }}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#edf2f7',
                            color: '#4a5568',
                            cursor: 'pointer',
                            fontWeight: '500',
                            height: '38px'
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {
                isLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }} > Loading...</div >
                ) : (
                    <div className="events-grid">
                        {eventsData?.data.events.map((event) => (
                            <div
                                key={event.id}
                                className="event-card"
                                onClick={() => navigate(`/user/events/${event.id}`)}
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
                                No events found.
                            </div>
                        )}
                    </div>
                )}
        </>
    );
};

export default UserEvents;
