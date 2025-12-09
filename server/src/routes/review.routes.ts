import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Create a review
router.post('/', authenticate, ReviewController.createReview);

// Delete a review
router.delete('/:id', authenticate, ReviewController.deleteReview);

// Get user's reviews
router.get('/me', authenticate, ReviewController.getUserReviews);

// Get reviews for an event
router.get('/event/:eventId', ReviewController.getEventReviews);

export default router;
