import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';

export class BookingController {
    private static bookingService = new BookingService();

    static async bookTicket(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { eventId } = req.body;

            if (!eventId) {
                return res.status(400).json({ message: 'Event ID is required' });
            }

            const booking = await BookingController.bookingService.bookTicket(userId, eventId);
            res.status(201).json({
                message: booking.status === 'waitlist' ? 'Added to waitlist' : 'Ticket booked successfully',
                data: booking,
            });
        } catch (error: any) {
            if (error.message === 'Event not found') {
                res.status(404).json({ message: error.message });
            } else if (error.message === 'Event is fully booked' || error.message === 'User already booked for this event') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async getMyTickets(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const query = req.query;
            const result = await BookingController.bookingService.getMyTickets(userId, query);
            res.json({
                message: 'Tickets retrieved successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async cancelTicket(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { id } = req.params;
            const result = await BookingController.bookingService.cancelTicket(userId, id);
            res.json(result);
        } catch (error: any) {
            console.error('Error cancelling ticket:', error);
            if (error.message === 'Booking not found') {
                res.status(404).json({ message: error.message });
            } else if (error.message === 'Unauthorized to cancel this booking') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async markAttendance(req: Request, res: Response) {
        try {
            const { ticket_number, status } = req.body;

            if (!ticket_number || !status) {
                return res.status(400).json({ message: 'Ticket number and status are required' });
            }

            const result = await BookingController.bookingService.markAttendance(ticket_number, status);
            res.json({
                message: 'Attendance marked successfully',
                data: result,
            });
        } catch (error: any) {
            if (error.message === 'Booking not found') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }
}
