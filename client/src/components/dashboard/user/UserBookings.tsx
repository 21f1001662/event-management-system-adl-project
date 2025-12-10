import { useState, useEffect } from 'react';
import { getMyTickets } from '@/api/booking';
import { getMyReviews } from '@/api/review';
import QRCode from 'react-qr-code';
import { X, Maximize2, MapPin, Calendar, Clock } from 'lucide-react';
import ReviewModal from '@/components/review/ReviewModal';
import './UserBookings.css';

const UserBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [userReviews, setUserReviews] = useState<any[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewEventId, setReviewEventId] = useState('');
    const [existingReview, setExistingReview] = useState<any>(null);

    useEffect(() => {
        fetchBookings();
        fetchUserReviews();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await getMyTickets({ limit: 100 });
            setBookings(response.data.tickets || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReviews = async () => {
        try {
            const response = await getMyReviews();
            setUserReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewClick = (eventId: string) => {
        const review = userReviews.find(r => r.event_id === eventId);
        setReviewEventId(eventId);
        setExistingReview(review);
        setReviewModalOpen(true);
    };

    const handleReviewSuccess = () => {
        fetchUserReviews();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return '#28a745';
            case 'waitlist': return '#ffc107';
            case 'cancelled': return '#dc3545';
            case 'attended': return '#4c51bf';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const TicketCard = ({ ticket, isModal = false }: { ticket: any, isModal?: boolean }) => {
        const qrValue = `${window.location.origin}/organizer/dashboard?tab=mark-attendance&ticket_number=${ticket.ticket_number}`;
        const hasReview = userReviews.some(r => r.event_id === ticket.event.id);

        return (
            <div className={`ticket-card ${isModal ? 'modal-ticket' : ''}`}>
                <div className="ticket-image-container">
                    {ticket.event.image_url ? (
                        <img src={ticket.event.image_url} alt={ticket.event.title} className="ticket-image" />
                    ) : (
                        <div className="ticket-image-placeholder">
                            <span>{ticket.event.title[0]}</span>
                        </div>
                    )}
                    <div className="ticket-status" style={{
                        backgroundColor: ticket.attendance === 'Present' ? '#4c51bf' : getStatusColor(ticket.status)
                    }}>
                        {ticket.attendance === 'Present' ? 'ATTENDED' : ticket.status}
                    </div>
                </div>

                <div className="ticket-content">
                    <h3 className="ticket-title">{ticket.event.title}</h3>
                    <p className="ticket-desc">{ticket.event.short_description}</p>

                    <div className="ticket-info">
                        <div className="info-row">
                            <Calendar size={16} />
                            <span>{formatDate(ticket.event.date)}</span>
                        </div>
                        <div className="info-row">
                            <Clock size={16} />
                            <span>{formatTime(ticket.event.date)}</span>
                        </div>
                        <div className="info-row">
                            <MapPin size={16} />
                            <span>{ticket.event.location}</span>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <div className="ticket-number">
                            <span className="label">Ticket #</span>
                            <span className="value">{ticket.ticket_number}</span>
                        </div>
                        {!isModal && (
                            <div className="ticket-actions-booking">
                                {ticket.attendance === 'Present' && (
                                    <button
                                        className={`review-btn ${hasReview ? 'view' : 'add'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReviewClick(ticket.event.id);
                                        }}
                                    >
                                        {hasReview ? 'View Review' : 'Add Review'}
                                    </button>
                                )}
                                <button className="expand-btn" onClick={() => setSelectedTicket(ticket)}>
                                    <Maximize2 size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {isModal && (
                        <div className="qr-section">
                            <div className="qr-code-wrapper">
                                <QRCode value={qrValue} size={150} />
                            </div>
                            <p className="qr-instruction">Scan to mark attendance</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading">Loading bookings...</div>;

    return (
        <div className="user-bookings-container">
            <h1 className="page-title">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>You haven't booked any events yet.</p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}

            {selectedTicket && (
                <div className="ticket-modal-overlay" onClick={() => setSelectedTicket(null)}>
                    <div className="ticket-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedTicket(null)}>
                            <X size={24} />
                        </button>
                        <TicketCard ticket={selectedTicket} isModal={true} />
                    </div>
                </div>
            )}

            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                eventId={reviewEventId}
                existingReview={existingReview}
                onSuccess={handleReviewSuccess}
            />
        </div>
    );
};

export default UserBookings;
