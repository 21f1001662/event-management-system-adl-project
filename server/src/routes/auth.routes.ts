import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/login/google', AuthController.login);
router.post('/refresh', AuthController.refresh);

export default router;
