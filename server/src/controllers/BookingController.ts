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
}
