import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEvent } from '@/hooks/api/event';
import { useBookTicket, useGetMyTickets, useCancelTicket } from '@/hooks/api/booking';
import { Loader2, Calendar, MapPin, Users, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, User, Ticket, XCircle } from 'lucide-react';
import '@/pages/EventDetails.css'; // Reuse existing styles

const UserEventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: event, isLoading, error } = useGetEvent(id || '');
    const { mutate: bookTicket, isPending: isBooking } = useBookTicket();
    const { mutate: cancelTicket, isPending: isCancelling } = useCancelTicket();

    // Fetch user's ticket for this event
    const { data: myTicketsData, isLoading: isLoadingTicket } = useGetMyTickets({ eventId: id });
    const myTicket = myTicketsData?.data?.tickets?.[0];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    if (isLoading || isLoadingTicket) {
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

    const handleBookClick = () => {
        setShowConfirmation(true);
    };

    const handleCancelClick = () => {
        setShowCancelConfirmation(true);
    };

    const confirmBooking = () => {
        if (!id) return;
        setBookingError(null);
        bookTicket(id, {
            onSuccess: () => {
                setShowConfirmation(false);
                setShowSuccess(true);
            },
            onError: (err: any) => {
                setShowConfirmation(false);
                setBookingError(err.response?.data?.message || 'Failed to book ticket');
            }
        });
    };

    const confirmCancellation = () => {
        if (!myTicket) return;
        setBookingError(null);
        cancelTicket(myTicket.id, {
            onSuccess: () => {
                setShowCancelConfirmation(false);
                setShowCancelSuccess(true);
            },
            onError: (err: any) => {
                setShowCancelConfirmation(false);
                setBookingError(err.response?.data?.message || 'Failed to cancel ticket');
            }
        });
    };

    return (
        <div className="event-details-container">
            {/* Header */}
            <header className="details-header">
                <div className="header-content">
                    <div className="header-top-row" style={{ width: '100%', marginBottom: '20px' }}>
                        <button className="back-btn" onClick={() => navigate('/user/dashboard')}>
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
                            {myTicket ? (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        backgroundColor: myTicket.status === 'confirmed' ? '#c6f6d5' : '#fefcbf',
                                        color: myTicket.status === 'confirmed' ? '#22543d' : '#744210',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <Ticket size={18} />
                                        {myTicket.status === 'confirmed' ? 'Booked' : 'Waitlisted'}
                                    </div>
                                    <button
                                        className="action-btn"
                                        style={{ backgroundColor: '#fed7d7', color: '#822727', border: '1px solid #feb2b2' }}
                                        onClick={handleCancelClick}
                                    >
                                        <XCircle size={18} />
                                        Cancel Ticket
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="action-btn primary"
                                    onClick={handleBookClick}
                                    disabled={event.attendees_count >= event.capacity && !event.allow_waitlist}
                                >
                                    {event.attendees_count >= event.capacity
                                        ? (event.allow_waitlist ? 'Join Waitlist' : 'Fully Booked')
                                        : 'Book Ticket'}
                                </button>
                            )}
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
                            <div className="full-desc">
                                {event.description}
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
                            {event.allow_waitlist && (
                                <div className="stat-row">
                                    <span className="stat-label">Waitlist</span>
                                    <span className="stat-value">{event.waitlist_count}</span>
                                </div>
                            )}
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

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirm Booking</h2>
                        <p>Are you sure you want to book a ticket for <strong>{event.title}</strong>?</p>
                        {event.attendees_count >= event.capacity && event.allow_waitlist && (
                            <div className="alert-warning" style={{ marginTop: '10px', padding: '10px', background: '#fff3cd', color: '#856404', borderRadius: '4px' }}>
                                <AlertCircle size={16} style={{ display: 'inline', marginRight: '5px' }} />
                                Note: This event is full. You will be added to the waitlist.
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowConfirmation(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmBooking} disabled={isBooking}>
                                {isBooking ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirmation && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Cancel Ticket</h2>
                        <p>Are you sure you want to cancel your ticket for <strong>{event.title}</strong>?</p>
                        <p style={{ fontSize: '0.9rem', color: '#718096' }}>This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowCancelConfirmation(false)}>Keep Ticket</button>
                            <button
                                className="confirm-btn"
                                style={{ backgroundColor: '#e53e3e' }}
                                onClick={confirmCancellation}
                                disabled={isCancelling}
                            >
                                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content success">
                        <CheckCircle size={48} color="#48bb78" />
                        <h2>Congratulations!</h2>
                        <p>
                            {event.attendees_count >= event.capacity
                                ? 'You have been added to the waitlist.'
                                : 'Your ticket has been booked successfully.'}
                        </p>
                        <button className="confirm-btn" onClick={() => { setShowSuccess(false); navigate('/user/dashboard'); }}>
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Cancel Success Modal */}
            {showCancelSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content success">
                        <CheckCircle size={48} color="#48bb78" />
                        <h2>Cancelled</h2>
                        <p>Your ticket has been cancelled successfully.</p>
                        <button className="confirm-btn" onClick={() => { setShowCancelSuccess(false); }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {bookingError && (
                <div className="modal-overlay">
                    <div className="modal-content error">
                        <AlertCircle size={48} color="#f56565" />
                        <h2>Error</h2>
                        <p>{bookingError}</p>
                        <button className="confirm-btn" onClick={() => setBookingError(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserEventDetails;
