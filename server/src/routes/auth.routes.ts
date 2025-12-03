import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

import { validationMiddleware } from '../middlewares/validation.middleware';
import { GoogleLoginDto, RefreshTokenDto } from '../dtos/auth.dto';

const router = Router();

router.post('/login/google', validationMiddleware(GoogleLoginDto), AuthController.login);
router.post('/refresh', validationMiddleware(RefreshTokenDto), AuthController.refresh);

export default router;
