import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roles.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateEventDto, GetEventsQueryDto } from '../dtos/EventDto';
import { UserRole } from '../entities/User';

const router = Router();

router.post(
    '/',
    authenticate,
    authorize([UserRole.ORGANIZER]),
    validationMiddleware(CreateEventDto),
    EventController.createEvent
);

router.get(
    '/',
    validationMiddleware(GetEventsQueryDto, 'query'),
    EventController.getAllEvents
);

export default router;
