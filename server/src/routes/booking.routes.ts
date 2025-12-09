import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, BookingController.bookTicket);
router.get('/my-tickets', authenticate, BookingController.getMyTickets);
router.delete('/:id', authenticate, BookingController.cancelTicket);

export default router;
