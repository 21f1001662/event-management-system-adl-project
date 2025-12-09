import { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';

export class ReviewController {
    private static reviewService = new ReviewService();

    static async createReview(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { eventId, review_text, rating } = req.body;

            if (!eventId || !review_text || !rating) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const review = await ReviewController.reviewService.createReview(userId, eventId, {
                review_text,
                rating,
            });

            res.status(201).json({
                message: 'Review created successfully',
                data: review,
            });
        } catch (error: any) {
            if (error.message === 'You have already reviewed this event') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async deleteReview(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            const userRole = (req as any).user.roles;

            await ReviewController.reviewService.deleteReview(id, userId, userRole);

            res.json({
                message: 'Review deleted successfully',
            });
        } catch (error: any) {
            if (error.message === 'Review not found') {
                res.status(404).json({ message: error.message });
            } else if (error.message === 'Unauthorized to delete this review') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    static async getEventReviews(req: Request, res: Response) {
        try {
            const { eventId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const result = await ReviewController.reviewService.getEventReviews(eventId, page, limit);

            res.json({
                data: result,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserReviews(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const reviews = await ReviewController.reviewService.getUserReviews(userId);

            res.json({
                data: reviews,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
