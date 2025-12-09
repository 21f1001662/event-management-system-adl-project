import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { authenticate } from '../middlewares/auth.middleware';

import { authorize } from '../middlewares/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

router.post('/', authenticate, BookingController.bookTicket);
router.get('/my-tickets', authenticate, BookingController.getMyTickets);
router.delete('/:id', authenticate, BookingController.cancelTicket);
router.put('/attendance', authenticate, authorize([UserRole.ORGANIZER]), BookingController.markAttendance);
router.get('/ticket/:ticketNumber', authenticate, authorize([UserRole.ORGANIZER]), BookingController.getTicketByNumber);
router.get('/event/:eventId/participants', authenticate, authorize([UserRole.ORGANIZER]), BookingController.getEventParticipants);

export default router;
