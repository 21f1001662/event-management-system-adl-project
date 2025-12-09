import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEvent } from '@/hooks/api/event';
import { deleteEvent } from '@/api/event';
import { Loader2, Calendar, MapPin, Users, Edit, User, ArrowLeft, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './EventDetails.css';

import ParticipantsModal from '@/components/organizer/ParticipantsModal';

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: event, isLoading, error } = useGetEvent(id || '');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);

    if (isLoading) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin" size={48} color="#4c51bf" />
            </div>
        );
    }

    if (error || !event) {
        return <div className="error-container">Failed to load event details.</div>;
    }

    const hasImage = !!event.image_url;
    const hasVideo = !!event.video_url;
    const hasBoth = hasImage && hasVideo;

    const nextSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone and will cancel all bookings.')) {
            try {
                await deleteEvent(id || '');
                navigate('/organizer');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    return (
        <div className="event-details-container">
            {/* Header */}
            <header className="details-header">
                <div className="header-content">
                    <div className="header-top-row" style={{ width: '100%', marginBottom: '20px' }}>
                        <button className="back-btn" onClick={() => navigate('/organizer')}>
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </button>
                    </div>
                    <div className="header-main">
                        <div className="header-left">
                            <h1 className="event-title">{event.title}</h1>
                            <div className="event-meta-row">
                                <div className="meta-item">
                                    <Calendar size={18} />
                                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="meta-item">
                                    <MapPin size={18} />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="action-btn secondary" onClick={() => setShowParticipantsModal(true)}>
                                <Users size={18} />
                                Participants ({event.attendees_count})
                            </button>
                            <button className="action-btn primary" onClick={() => navigate(`/organizer/events/${id}/edit`)}>
                                <Edit size={18} />
                                Edit Event
                            </button>
                            <button className="action-btn danger" onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="details-content">
                <div className="content-grid">
                    {/* Left Column: Media & Description */}
                    <div className="main-column">
                        <div className="media-section">
                            {hasBoth ? (
                                <div className="slideshow-container">
                                    <div className="slide">
                                        {currentSlide === 0 ? (
                                            <img src={event.image_url} alt={event.title} className="event-media" />
                                        ) : (
                                            <video src={event.video_url} controls className="event-media" />
                                        )}
                                    </div>
                                    <button className="slide-btn prev" onClick={prevSlide}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button className="slide-btn next" onClick={nextSlide}>
                                        <ChevronRight size={24} />
                                    </button>
                                    <div className="slide-indicators">
                                        <span className={`indicator ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)}></span>
                                        <span className={`indicator ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)}></span>
                                    </div>
                                </div>
                            ) : hasVideo ? (
                                <video src={event.video_url} controls className="event-media" />
                            ) : hasImage ? (
                                <img src={event.image_url} alt={event.title} className="event-media" />
                            ) : (
                                <div className="no-media">No Media Available</div>
                            )}
                        </div>

                        <div className="description-section">
                            <h2>About this Event</h2>
                            <p className="short-desc">{event.short_description}</p>
                            <div className="full-desc" data-color-mode="light">
                                <ReactMarkdown>{event.description}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Info */}
                    <aside className="sidebar-column">
                        <div className="info-card">
                            <h3>Event Stats</h3>
                            <div className="stat-row">
                                <span className="stat-label">Capacity</span>
                                <span className="stat-value">{event.capacity}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">Registered</span>
                                <span className="stat-value">{event.attendees_count}</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${Math.min((event.attendees_count / event.capacity) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3>Organizer</h3>
                            <div className="organizer-info">
                                <div className="organizer-avatar">
                                    <User size={24} />
                                </div>
                                <div>
                                    <div className="organizer-name">{event.organizer.name}</div>
                                    <div className="organizer-email">{event.organizer.email}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {showParticipantsModal && (
                <ParticipantsModal
                    eventId={id || ''}
                    onClose={() => setShowParticipantsModal(false)}
                />
            )}
        </div>
    );
};

export default EventDetails;
