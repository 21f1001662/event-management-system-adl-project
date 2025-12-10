import React, { useState, useEffect, useCallback } from 'react';
import { getTicketByNumber, markAttendance } from '../../api/event';
import { useSearchParams } from 'react-router-dom';
import './MarkAttendance.css';

const MarkAttendance: React.FC = () => {
    const [searchParams] = useSearchParams();
    const ticketNumberParam = searchParams.get('ticket_number');

    const [ticketNumber, setTicketNumber] = useState(ticketNumberParam || '');
    const [ticketDetails, setTicketDetails] = useState<any>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckTicket = useCallback(async (number: string = ticketNumber) => {
        if (!number) return;
        setLoading(true);
        setError('');
        setTicketDetails(null);
        try {
            const data = await getTicketByNumber(Number(number));
            setTicketDetails(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ticket Not found');
        } finally {
            setLoading(false);
        }
    }, [ticketNumber]);

    useEffect(() => {
        if (ticketNumberParam) {
            handleCheckTicket(ticketNumberParam);
        }
    }, [ticketNumberParam, handleCheckTicket]);

    const handleMarkAttendance = async (status: string) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await markAttendance(Number(ticketNumber), status);
            setSuccessMessage(`Attendance marked as ${status}`);
            // Refresh ticket details
            const data = await getTicketByNumber(Number(ticketNumber));
            setTicketDetails(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error marking attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mark-attendance-container">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Mark Attendance</h2>
            <div className="input-group">
                <input
                    type="number"
                    placeholder="Enter Ticket Number"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                />
                <button onClick={() => handleCheckTicket()} disabled={loading || !ticketNumber}>
                    {loading ? 'Checking...' : 'Check Ticket'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {ticketDetails && (
                <div className="ticket-details-card">
                    <div className="ticket-header">
                        <h3>Ticket #{ticketDetails.ticket_number}</h3>
                        <span className={`status-badge ${ticketDetails.attendance.toLowerCase()}`}>
                            {ticketDetails.attendance}
                        </span>
                    </div>
                    <div className="ticket-body">
                        <div className="detail-row">
                            <span className="label">Event:</span>
                            <span className="value">{ticketDetails.event.title}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Attendee:</span>
                            <span className="value">{ticketDetails.user.name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Email:</span>
                            <span className="value">{ticketDetails.user.email}</span>
                        </div>
                    </div>
                    <div className="ticket-actions">
                        <button
                            className="btn-present"
                            onClick={() => handleMarkAttendance('Present')}
                            disabled={loading}
                        >
                            Mark Present
                        </button>
                        <button
                            className="btn-absent"
                            onClick={() => handleMarkAttendance('Absent')}
                            disabled={loading}
                        >
                            Mark Absent
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;
