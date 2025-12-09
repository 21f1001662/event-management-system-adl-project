import React, { useState, useEffect, useCallback } from 'react';
import { getEventParticipants } from '@/api/booking';
import { X, Loader2, ChevronLeft, ChevronRight, User, Clock, Ticket } from 'lucide-react';
import './ParticipantsModal.css';

interface ParticipantsModalProps {
    eventId: string;
    onClose: () => void;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ eventId, onClose }) => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalParticipants, setTotalParticipants] = useState(0);

    const fetchParticipants = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getEventParticipants(eventId, { page, limit: 10 });
            setParticipants(response.data.participants);
            setTotalPages(response.data.totalPages);
            setTotalParticipants(response.data.total);
        } catch (error) {
            console.error('Error fetching participants:', error);
        } finally {
            setLoading(false);
        }
    }, [eventId, page]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return '#28a745';
            case 'waitlist': return '#ffc107';
            case 'cancelled': return '#dc3545';
            case 'attended': return '#007bff';
            default: return '#6c757d';
        }
    };

    return (
        <div className="participants-modal-overlay" onClick={onClose}>
            <div className="participants-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Participants ({totalParticipants})</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 className="animate-spin" size={32} />
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="empty-state">
                            <p>No participants found.</p>
                        </div>
                    ) : (
                        <div className="participants-list">
                            {participants.map((participant) => (
                                <div key={participant.id} className="participant-item">
                                    <div className="participant-info">
                                        <div className="participant-avatar">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="participant-name">{participant.user.name}</div>
                                            <div className="participant-email">{participant.user.email}</div>
                                        </div>
                                    </div>

                                    <div className="participant-meta">
                                        <div className="meta-row">
                                            <Ticket size={14} />
                                            <span className="ticket-number">#{participant.ticket_number}</span>
                                        </div>
                                        <div className="meta-row">
                                            <Clock size={14} />
                                            <span>{formatDate(participant.created_at)}</span>
                                        </div>
                                        <div className="status-badge" style={{ backgroundColor: getStatusColor(participant.status) }}>
                                            {participant.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        className="pagination-btn"
                        disabled={page === 1 || loading}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="page-info">
                        Page {page} of {totalPages || 1}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipantsModal;
