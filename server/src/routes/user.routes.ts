import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/own', authenticate, authorize([UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER]), UserController.getOwnProfile);
router.put('/profile', authenticate, authorize([UserRole.ADMIN, UserRole.USER, UserRole.ORGANIZER]), UserController.updateProfile);
router.get('/', authenticate, authorize([UserRole.ADMIN]), UserController.getAllUsers);
router.post('/:id/verify', authenticate, authorize([UserRole.ADMIN]), UserController.verifyOrganizer);

export default router;
