import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import healthRoutes from './health.routes';
import eventRoutes from './event.routes';
import bookingRoutes from './booking.routes';
import storageRoutes from './storage.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/health', healthRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/storage', storageRoutes);

export default router;
