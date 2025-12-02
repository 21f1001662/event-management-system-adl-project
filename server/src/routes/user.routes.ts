import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

router.get('/own', authenticate, authorize([UserRole.ADMIN, UserRole.USER]), UserController.getOwnProfile);

export default router;
