import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllEvents } from '@/hooks/api/event';
import { Image as ImageIcon } from 'lucide-react';

const UserEvents = () => {
    const navigate = useNavigate();

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
        orderBy: orderBy,
        order: 'DESC',
        limit: 100,
        approved: 'true'
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
