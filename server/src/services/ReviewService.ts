import { AppDataSource } from '../config/database';
import { Review } from '../entities/Review';
import { Event } from '../entities/Event';
import { UserRole } from '../entities/User';

export class ReviewService {
    private reviewRepository = AppDataSource.getRepository(Review);
    private eventRepository = AppDataSource.getRepository(Event);

    async createReview(userId: string, eventId: string, data: { review_text: string; rating: number }) {
        const { review_text, rating } = data;

        // Check if review already exists
        const existingReview = await this.reviewRepository.findOne({
            where: { user_id: userId, event_id: eventId },
        });

        if (existingReview) {
            throw new Error('You have already reviewed this event');
        }

        const review = this.reviewRepository.create({
            user_id: userId,
            event_id: eventId,
            review_text,
            rating,
        });

        await this.reviewRepository.save(review);
        await this.updateEventStats(eventId);

        return review;
    }

    async deleteReview(reviewId: string, userId: string, userRole: UserRole[]) {
        const review = await this.reviewRepository.findOne({ where: { id: reviewId } });

        if (!review) {
            throw new Error('Review not found');
        }

        // Allow deletion if user is the owner or an admin
        if (review.user_id !== userId && !userRole.includes(UserRole.ADMIN)) {
            throw new Error('Unauthorized to delete this review');
        }

        await this.reviewRepository.remove(review);
        await this.updateEventStats(review.event_id);
    }

    async getEventReviews(eventId: string) {
        return await this.reviewRepository.find({
            where: { event_id: eventId },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }

    private async updateEventStats(eventId: string) {
        const reviews = await this.reviewRepository.find({ where: { event_id: eventId } });
        const count = reviews.length;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = count > 0 ? totalRating / count : 0;

        await this.eventRepository.update(eventId, {
            review_count: count,
            avg_rating: parseFloat(avgRating.toFixed(1)),
        });
    }
}
