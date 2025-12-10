import { Router } from 'express';
import { StorageController } from '../controllers/StorageController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roles.middleware';
import { UserRole } from '../entities/User';

const router = Router();

// Only organizers and admins should be able to upload media
router.get(
    '/presigned-url',
    authenticate,
    authorize([UserRole.ORGANIZER, UserRole.ADMIN, UserRole.USER]),
    StorageController.getPresignedUrl
);

export default router;
